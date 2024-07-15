import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY,
});


app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const completion = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            temperature: 0.2,
            max_tokens: 2048,
            messages: [
                { role: "user", content: message }
            ]
        });
        res.json(completion.content[0]);
    } catch (error) {
        const errorMessage = handleError(error);
        res.status(500).json([{ type: 'error', text: errorMessage }]);
    }
});

function handleError(error: unknown): string {
    if (error instanceof Anthropic.APIError) {
        return `API Error: ${error.message}`;
    } else if (error instanceof Error) {
        return error.message;
    } else {
        return 'An unknown error occurred.';
    }
}

export const api = functions.https.onRequest(app);