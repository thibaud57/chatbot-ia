import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as functions from 'firebase-functions';
import OpenAI from 'openai';

// Types
type Role = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

interface ChatRequest {
  message: string;
  messageHistory?: ChatMessage[];
  temperature: number;
  maxTokens: number;
  model: string;
}

// Constants
const SYSTEM_PROMPT =
  'Tu es un expert en développement logiciel. Analyse le code fourni avec attention et donne des réponses détaillées.';
const DEFAULT_REGION = 'us-central1';

// Modèle regex pour identifier les différents types de modèles
const MODEL_PATTERNS = {
  CLAUDE: /^claude/,
  GPT: /^gpt/,
};

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// API Clients initialization
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const {
      message,
      messageHistory = [],
      temperature,
      maxTokens,
      model,
    } = req.body as ChatRequest;

    // Préparer les messages avec l'historique
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messageHistory,
      { role: 'user', content: message },
    ];

    let assistantResponse: string;

    // Déterminer quel modèle utiliser basé sur le nom
    if (MODEL_PATTERNS.CLAUDE.test(model)) {
      assistantResponse = await handleClaude(
        messages,
        model,
        temperature,
        maxTokens
      );
    } else if (MODEL_PATTERNS.GPT.test(model)) {
      assistantResponse = await handleChatGPT(
        messages,
        model,
        temperature,
        maxTokens
      );
    } else {
      throw new Error(`Modèle non supporté: ${model}`);
    }

    const updatedHistory = [
      ...messageHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: assistantResponse },
    ];

    res.json({
      response: assistantResponse,
      history: updatedHistory,
    });
  } catch (error) {
    const errorMessage = handleError(error);
    res.status(500).json([{ type: 'error', text: errorMessage }]);
  }
});

async function handleClaude(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  try {
    const completion = await anthropic.messages.create({
      model,
      temperature,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: messages
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
    });

    if (completion.content[0].type === 'text') {
      return completion.content[0].text;
    }
    throw new Error('Format de réponse Claude invalide');
  } catch (error) {
    console.error('Erreur Claude:', error);
    throw error;
  }
}

async function handleChatGPT(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Format de réponse ChatGPT invalide');
    }
    return content;
  } catch (error) {
    console.error('Erreur ChatGPT:', error);
    throw error;
  }
}

function handleError(error: unknown): string {
  if (error instanceof Anthropic.APIError) {
    return `Erreur Claude: ${error.message}`;
  } else if (error instanceof OpenAI.APIError) {
    return `Erreur ChatGPT: ${error.message}`;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue.';
}

export const api = functions
  .region(process.env.REGION || DEFAULT_REGION)
  .https.onRequest(app);
