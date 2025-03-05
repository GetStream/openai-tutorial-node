# Stream Video AI Demo Server

A demo Node.js server for integrating Stream's Video SDK with OpenAI's Realtime API. This project showcases how to build AI-powered video applications with voice interactions.

## What This Repository Does

This repository provides two main components:

1. **Standalone UI**: A simple script that launches a browser-based video call with an AI assistant powered by OpenAI's Realtime API.

2. **Server API**: A Hono-based HTTP server that provides endpoints for creating and managing AI-powered video calls.

Both components demonstrate how to use Stream's Video SDK to create video calls and connect them with OpenAI's Realtime API for AI-powered voice interactions.

## Prerequisites

- Node.js 22 or later
- Stream account with API key and secret
- OpenAI API key with access to the Realtime API

## Getting Started

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/stream-video-ai-demo-server.git
   cd stream-video-ai-demo-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

   You can copy the example file as a starting point:
   ```bash
   cp .env.example .env
   ```

## Running the Standalone UI

The standalone UI provides a quick way to test the AI-powered video call experience:

```bash
npm run standalone-ui
```

This will:
1. Create a new video call with a unique ID
2. Connect an OpenAI AI assistant to the call
3. Open your default browser with a URL to join the call
4. Log all events from the OpenAI Realtime API to the console

You can speak to the AI assistant through your microphone, and it will respond with voice and can perform actions based on your requests.

## Running the Server

The server provides API endpoints for creating and managing AI-powered video calls:

```bash
npm run server
```

This starts an HTTP server on port 3000 (by default).

### Server Endpoints

#### GET /credentials

Creates a new video call and returns the necessary credentials to join it.

**Response:**
```json
{
  "apiKey": "your_stream_api_key",
  "token": "user_authentication_token",
  "callType": "default",
  "callId": "unique_call_id",
  "userId": "user_id"
}
```

Use these credentials in your frontend application to connect to the video call.

#### POST /:callType/:callId/connect

Connects an OpenAI AI assistant to an existing video call.

**URL Parameters:**
- `callType`: The type of call (e.g., "default")
- `callId`: The unique ID of the call to connect to

**Response:**
```json
{
  "ok": true
}
```

After calling this endpoint, the AI assistant will join the specified call and be ready to interact with users.

### Example Usage

1. Call the `/credentials` endpoint to create a new call and get connection details
2. Use the Stream Video SDK in your frontend to join the call with the provided credentials
3. Call the `/:callType/:callId/connect` endpoint with the call type and ID to connect the AI assistant
4. Interact with the AI assistant through voice in the video call

## License

This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details. 