# Chatbot

Chatbot is an intelligent web-based assistant that leverages AI and real-time web scraping to answer user questions with up-to-date information. It combines the power of OpenAI's GPT model, SerpAPI for search results, and Cheerio for DOM parsing—making it a lightweight but highly effective tool for context-aware web research.

This project showcases skills across:
- AI prompt engineering
- Web scraping and dynamic data parsing
- Message Timestamps: Each message is displayed with the time it was sent, providing clear chronological context to the conversation.
- RESTful API design with Express.js
- Third-party API integrations (OpenAI + SerpAPI)
- Responsive Design: Optimized for desktop and mobile devices.
- Interactive chat interface for seamless user experience.

## Demo

## Features

- Real-time web search using SerpAPI
- AI-powered natural language understanding via GPT-4o-mini
- Converts scraped HTML to Markdown for structured AI input
- Context memory using lightweight in-memory cache
- User-friendly UI with typing indicators and chat history
- Secure API key management via .env file
- Auto-clears conversation history every hour

## Tech Stack

| Layer               | Tech                       |
| ------------------- | -------------------------- |
| Backend             | Node.js, Express           |
| Frontend            | HTML, CSS (custom), JS     |
| AI Integration      | OpenAI API (`gpt-4o-mini`) |
| Search API          | SerpAPI                    |
| Scraping            | Cheerio                    |
| Markdown Conversion | html-to-markdown           |
| Caching             | In-memory (Map)            |

## Installation & Usage

### 1. Clone the repo
```
git clone https://github.com/yourusername/scraper-chatbot.git
cd scraper-chatbot
```

### 2. Install dependencies

```
npm install
```
### Add environment variables
Create a .env file in the root directory:

```
serpApiKey=your_serpapi_key
openaiApiKey=your_openai_api_key
port=3000
```

### 4. Run the server

```
node index.js
```

Visit: `http://localhost:3000`

