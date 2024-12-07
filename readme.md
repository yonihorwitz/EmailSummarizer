# Project Setup

## Prerequisites
- Docker
- Docker Compose
- Node.js

- Nylas account
- OpenAI account

## Setup Instructions

1. Clone the repository
- git clone https://github.com/yonihorwitz/EmailSummarizer.git
- cd EmailSummarizer

2. Set up environment variables according to .env.example

3. Start the stack
- docker compose up --build


## Using the App

1. Open http://localhost:3000 on the browser
2. Log in to a Nylas account
3. Hit the "Sync Emails" button


## TODO:

- TYPESCRIPT
- Better DB migration management, or ORM
- Generic API for e-mail sync tool
- Tests
- Async message back to FE on sync completion