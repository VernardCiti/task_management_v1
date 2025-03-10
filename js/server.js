// // server.js
// import express from 'express';
// import OpenAI from 'openai';

// const app = express();
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY
// });

// app.post('/ask', async (req, res) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{
//         role: "system",
//         content: req.body.context + " Respond in Markdown format."
//       }, {
//         role: "user",
//         content: req.body.question
//       }],
//       temperature: 0.7,
//       max_tokens: 150
//     });

//     res.json({ answer: completion.choices[0].message.content });
//   } catch (error) {
//     res.status(500).json({ error: "AI service unavailable" });
//   }
// });
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON bodies
// app.use(express.json());
// Enable CORS if needed
// app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY
// });

app.post('/ask', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: req.body.context + " Respond in Markdown format."
      }, {
        role: "user",
        content: req.body.question
      }],
      temperature: 0.7,
      max_tokens: 150
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI service unavailable" });
  }
});
