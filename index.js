const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');
const htmlToMarkdown = require('html-to-markdown');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const config = {
  serpApiKey: process.env.serpApiKey,
  openaiApiKey: process.env.openaiApiKey,
  port: process.env.port || 3000,
};

const openai = new OpenAI({ apiKey: config.openaiApiKey });

// Cache
const conversationCache = new Map();

app.post('/ask', async (req, res) => {
  try {
    const { question, conversationId } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let conversation = conversationCache.get(conversationId) || {
      history: [
        { 
          role: "system", 
          content: "You are a helpful research assistant that provides concise answers based on web research. " +
                  "When you don't know something, you'll search the web for up-to-date information."
         // "content" : "You are a smart, helpful AI assistant that can perform mathematical calculations, solve logical reasoning problems, and answer questions using up-to-date knowledge from the web (as provided in the user messages or tool outputs). If a query requires current events, data, or specific external information, ask the user to provide it or use the available tools if enabled. Be clear, concise, and honest. When solving problems, show your work step by step unless asked otherwise. Always aim to be accurate, helpful, and friendly."
        }
      ],
      lastSearchQuery: null,
      lastSearchResults: null
    };

    // Follow up
    const isFollowUp = conversation.history.length > 1 && 
                      conversation.history[conversation.history.length-2].role === "user";

    let context = '';
    let searchPerformed = false;
    
    if (!isFollowUp || question.toLowerCase().includes("search") || question.toLowerCase().includes("what")) {
      const searchResults = await getSearchResults(question);
      searchPerformed = true;
      
      if (searchResults.organic_results && searchResults.organic_results.length > 0) {
        conversation.lastSearchQuery = question;
        conversation.lastSearchResults = searchResults;

        const topResult = searchResults.organic_results[0];
        const scrapedContent = await scrapeWebsite(topResult.link);
        
        if (scrapedContent) {
          context = htmlToMarkdown.convert(scrapedContent).substring(0, 4000);
        }
      }
    }

    conversation.history.push({ role: "user", content: question });

    const messages = [...conversation.history];

    if (context) {
      messages.splice(1, 0, { 
        role: "system",
        content: `Here's some web context that might help answer the question:\n${context}`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.5,
      max_tokens: 500
    });

    const answer = response.choices[0].message.content.trim();

    conversation.history.push({ role: "assistant", content: answer });
    
    conversationCache.set(conversationId, conversation);

    res.json({ 
      answer,
      conversationId: conversationId || Date.now().toString(), 
      searchPerformed 
    });
    
  } catch (error) {
    console.error('Error:', error);
    
    let errorMessage = "I couldn't process your question right now. Please try again later.";
    
    if (error.response) {
      if (error.response.status === 429) {
        errorMessage = "I'm getting too many requests. Please wait a minute and try again.";
      } else if (error.response.status === 503) {
        errorMessage = "The service is temporarily unavailable. Please try again soon.";
      }
    } else if (error.code === 'insufficient_quota') {
      errorMessage = "My knowledge service is currently unavailable. Please check back later.";
    }

    res.status(500).json({ error: errorMessage });
  }
});

async function getSearchResults(query) {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: config.serpApiKey,
        num: 3,
        hl: 'en',
        gl: 'us'
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('Search API Error:', error);
    return { organic_results: [] };
  }
}

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000
    });
    
    const $ = cheerio.load(response.data);
    
    $('script, style, nav, footer, iframe, img, noscript').remove();
    
    let content = '';
    const contentSelectors = [
      'article', 
      'main', 
      '.post-content', 
      '.article-body', 
      'p', 
      'h1, h2, h3, h4, h5, h6', 
      'li'
    ];
    
    contentSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.split(/\s+/).length > 3) {
          content += text + '\n\n';
        }
      });
    });
    
    return content.trim() || null;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: "An unexpected error occurred. Please try again." });
}); // Error handling middleware

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
// console.log(process.env.serpApiKey)

setInterval(() => { // to delete conv older than 1hour
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  conversationCache.forEach((conversation, id) => {
    if (now - parseInt(id) > oneHour) {
      conversationCache.delete(id);
    }
  });
}, 30 * 60 * 1000); //delete old conv (checks every 30 minutes)

