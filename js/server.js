import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';

const app = express();

// CORS Configuration - Allow 'x-requested-with'
app.use(cors({
  origin: [
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],  // Added 'x-requested-with'
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add explicit OPTIONS handler for preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');  // Add header
  res.sendStatus(204);  // Send status for successful preflight response
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY missing in .env file');
}

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
console.log('API Key Status:', 
  process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'
);

// Portfolio FAQ
const portfolioFAQ = {
  "skills": "My technical skills include: Full Stack Development (JavaScript, Python, Java), AI/ML (TensorFlow, PyTorch), and Cloud DevOps (AWS, Docker).",
  "experience": "I have X years of experience in software development with a focus on AI-driven solutions.",
  "projects": "Check out my Solutions tab for detailed project information!",
  "education": "I hold an Honours degree in Computer Science and Information Technology from Lobachevsky State University of Nizhny Novgorod, Russia. I matriculated from Magwagwaza High School in Acornhoek, Mpumalanga.",
  "contact": "You can reach me through the contact form on my website or via email at example@example.com.",
  "location": "I am based in Cape Town, Western Cape, South Africa.",
  "availability": "I am currently open to freelance projects and full-time opportunities. Feel free to get in touch!",
  "services": "I offer services in software development, AI/ML solutions, and cloud infrastructure management.",
  "testimonials": "See what my clients have to say in the Testimonials section of my website.",
  "blog": "I share insights on technology and development in my Blog section.",
  "social": "Connect with me on LinkedIn, Twitter, and GitHub through the links provided on my website.",
  "portfolio": "Browse my portfolio to see examples of my work and projects.",
  "certifications": "I hold certifications in AWS Solutions Architect and TensorFlow Developer.",
  "languages": "I am fluent in English and have conversational proficiency in Russian.",
  "hobbies": "In my free time, I enjoy hiking, photography, and contributing to open-source projects."
};

// Endpoint with error handling
app.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // 1. First check portfolio-specific questions
    const portfolioAnswers = {
      skills: "My technical skills include...",
      experience: "I have X years of experience...",
      // ... (your existing portfolioFAQ data)
    };
    
    const portfolioKey = Object.keys(portfolioAnswers).find(key => 
      question.toLowerCase().includes(key.toLowerCase())
    );
    
    if (portfolioKey) {
      return res.json({ 
        answer: portfolioAnswers[portfolioKey],
        source: "portfolio"
      });
    }

    // 2. For other questions, use OpenAI with portfolio context
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You're a portfolio assistant for ${context}. 
                  Answer technical questions based on provided info and 
                  general CS knowledge. Be concise and professional.`
      }, {
        role: "user",
        content: question
      }]
    });

    res.json({
      answer: completion.choices[0].message.content,
      source: "openai"
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
