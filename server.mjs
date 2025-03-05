import { serve } from "@hono/node-server";
import { StreamClient } from "@stream-io/node-sdk";
import { Hono } from "hono";
import crypto from 'crypto';
import { config } from 'dotenv';

// load config from dotenv
config();

// Get environment variables
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const openAiApiKey = process.env.OPENAI_API_KEY;

// Check if all required environment variables are set
if (!streamApiKey || !streamApiSecret || !openAiApiKey) {
    console.error("Error: Missing required environment variables, make sure to have a .env file in the project root, check .env.example for reference");
    process.exit(1);
}

const app = new Hono();
const streamClient = new StreamClient(streamApiKey, streamApiSecret);

/**
 * Endpoint to generate credentials for a new video call.
 * Creates a unique call ID, generates a token, and returns necessary connection details.
 */
app.get("/credentials", (c) => {
  const callId = crypto.randomUUID();
  const call = streamClient.video.call("default", callId);
  const token = streamClient.generateUserToken({
    user_id: `openai-demo-${callId}`,
  });
  return c.json({
    apiKey: streamApiKey,
    token,
    cid: call.cid,
  });
});

/**
 * Endpoint to connect an AI agent to an existing video call.
 * Takes a call ID parameter, connects the OpenAI agent to the call,
 * sets up the realtime client with event handlers and tools,
 * and returns a success response when complete.
 */
app.post("/:id/connect", async (c) => {
  const id = c.req.param("id");

  const call = streamClient.video.call("default", id);
  const realtimeClient = await streamClient.video.connectOpenAi({
    call,
    openAiApiKey,
    agentUserId: "lucy",
  });
  await setupRealtimeClient(realtimeClient);

  return c.json({ ok: true });
});

async function setupRealtimeClient(realtimeClient) {
  realtimeClient.on("error", (event) => {
    console.error("Error:", event);
  });

  realtimeClient.on("session.update", (event) => {
    console.log("Realtime session update:", event);
  });

  realtimeClient.updateSession({
    instructions: "You are a helpful assistant that can answer questions and help with tasks.",
  });

  realtimeClient.addTool(
    {
      name: "get_weather",
      description:
        "Call this function to retrieve current weather information for a specific location. Provide the city name.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The name of the city to get weather information for",
          },
        },
        required: ["city"],
      },
    },
    async ({ city, country, units = "metric" }) => {
      console.log("get_weather request", { city, country, units });
      try {
        // This is a placeholder for actual weather API implementation
        // In a real implementation, you would call a weather API service here
        const weatherData = {
          location: country ? `${city}, ${country}` : city,
          temperature: 22,
          units: units === "imperial" ? "°F" : "°C",
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 10
        };
        
        return weatherData;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return { error: "Failed to retrieve weather information" };
      }
    },
  );

  return realtimeClient;
}

// Start the server
serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",
  port: 3000,
});

console.log(`Server started on :3000`);
