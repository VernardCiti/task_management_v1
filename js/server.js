import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Enhanced CORS configuration
app.use(cors({
  // origin: process.env.CORS_ORIGINS?.split(',') || '*',
  origin:"*",
  methods: ['GET','POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preflight handler
app.options('/ask', cors());

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint with error handling
app.post('/ask', async (req, res) => {
  try {
    if (!req.body.question) {
      return res.status(400).json({ error: "Missing question" });
    }

    res.json({ answer: "Hello! This is a test response." });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: "AI service unavailable", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));