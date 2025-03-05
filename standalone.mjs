import { config } from 'dotenv';
import { StreamClient } from '@stream-io/node-sdk';
import open from 'open';
import crypto from 'crypto';

// load config from dotenv
config();

async function main() {
    // Get environment variables
    const streamApiKey = process.env.STREAM_API_KEY;
    const streamApiSecret = process.env.STREAM_API_SECRET;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    // Check if all required environment variables are set
    if (!streamApiKey || !streamApiSecret || !openAiApiKey) {
        console.error("Error: Missing required environment variables, make sure to have a .env file in the project root, check .env.example for reference");
        process.exit(1);
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret);
    const call = streamClient.video.call("default", crypto.randomUUID());

    // realtimeClient is https://github.com/openai/openai-realtime-api-beta openai/openai-realtime-api-beta
    const realtimeClient = await streamClient.video.connectOpenAi({
        call,
        openAiApiKey,
        agentUserId: "lucy",
    });

    // Set up event handling, all events from openai realtime api are available here see: https://platform.openai.com/docs/api-reference/realtime-server-events
    realtimeClient.on('realtime.event', ({ time, source, event }) => {
        console.log(`got an event from OpenAI ${event.type}`);
        if (event.type === 'response.audio_transcript.done') {
            console.log(`got a transcript from OpenAI ${event.transcript}`);
        }
    });

    realtimeClient.updateSession({
        instructions: "You are a helpful assistant that can answer questions and help with tasks.",
    });

    // Get token for the call
    const token = streamClient.generateUserToken({user_id:"theodore"});

    // Construct the URL, TODO: replace this with 
    const callUrl = `https://pronto.getstream.io/join/${call.id}?type=default&api_key=${streamClient.apiKey}&token=${token}&skip_lobby=true`;

    // Open the browser
    console.log(`Opening browser to join the call... ${callUrl}`);
    await open(callUrl);
}

main().catch(error => {
    console.error("Error:", error);
    process.exit(1);
});
