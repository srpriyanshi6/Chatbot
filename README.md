# Chatbot

Chatbot is an intelligent web-based assistant that leverages AI and real-time web scraping to answer user questions with up-to-date information. It combines the power of OpenAI's GPT model, SerpAPI for search results, and Cheerio for DOM parsing—making it a lightweight but highly effective tool for context-aware web research.

This project showcases skills across:

- Web scraping and dynamic data parsing
- RESTful API design with Express.js
- Third-party API integrations (OpenAI + SerpAPI)
- Interactive chat interface for seamless user experience.
- AI-powered natural language understanding via GPT-4o-mini
- Converts scraped HTML to Markdown for structured AI input
  
## Features
- User-friendly UI with typing indicators and chat history
- Message Timestamps: Each message is displayed with the time it was sent, providing clear chronological context to the conversation.
- Responsive Design: Optimized for desktop and mobile devices.
- Answer user queries within seconds.
- Easily takes up follow-up questions and understands the context of the follow-up question.
- Understands spelling mistakes easily.
- Context memory using lightweight in-memory cache
- Auto-clears conversation history every hour
- Secure API key management via .env file

## Answer queries within seconds :
![image](https://github.com/user-attachments/assets/8926b189-e06f-4fa8-88a1-0f7cd9b65398)

## Easily take up follow-up questions and understands the context :
![image](https://github.com/user-attachments/assets/726ebc34-2435-480d-834e-488dac43629c)

### Each message is displayed with the time it was sent (shown in above screenshot)

## Responsive design:
![image](https://github.com/user-attachments/assets/a70dfc32-d267-4043-9434-78ea473e0888)
### For small screen:
![image](https://github.com/user-attachments/assets/71f7ba91-97db-45c7-9ffa-bb6974851edb)




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

