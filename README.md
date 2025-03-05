# Stream Video AI Demo Server

This repository contains a demo server for Stream's Video AI integration.

## Requirements

- Node.js 14 or later (required by the Stream SDK)

> **Important**: The Stream SDK uses modern JavaScript features that require Node.js 14 or later. If you're using an older version of Node.js, you'll need to upgrade.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the project root with the following variables:

```
# Stream API credentials
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# OpenAI API key
OPENAI_API_KEY=your_openai_api_key
```

You can copy the `.env.example` file as a starting point:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual API keys.

## Usage

### Running the Server

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

### Standalone UI

The standalone UI allows you to quickly start a video call with an AI assistant:

```bash
npm run standalone-ui
```

If you're using nvm and need to use a specific Node.js version:

```bash
nvm use 22 && npm run standalone-ui
```

This will:
1. Open a browser window with a video call interface where you can interact with the AI assistant
2. Log all events from the OpenAI realtime client to the console
3. Keep the process running until you press Ctrl+C

The console output will show all events happening during the call, which is useful for debugging and understanding the interaction flow. 