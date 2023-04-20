# Installation
1. Run `npm install`
2. Run the CORS proxy `node cors`
3. Run the bot `npm run dev`

# Running the bot
1. Copy `.env.example` to `.env` and put in API keys
2. Run `run_bot.bat`

# Developing the bot
1. Run `npm run dev`, this will start the node cors proxy and vite
2. Run `node ./src/server.mjs`, this will start up the server

Note: for mac you should set cors port to 8081, 8080 sometimes doesnt seem to work.