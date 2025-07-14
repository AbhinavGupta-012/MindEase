const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(promptText) {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: promptText }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000, // 20 seconds
        family: 4
      }
    );
    console.log('✅ Gemini raw response:', JSON.stringify(response.data, null, 2));
    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    if (err.response) {
      console.error('❌ Gemini API Error:', err.response.status, err.response.data);
    } else if (err.request) {
      console.error('❌ Gemini API No Response:', err.message);
    } else {
      console.error('❌ Gemini API Unknown Error:', err.message);
    }
    throw new Error('Gemini API error');
  }
}

// Journal Prompts
router.post('/generate/journal-prompts', async (req, res) => {
  try {
    const prompt = "Generate 3 short, reflective journaling prompts to help a college student manage stress and anxiety.";
    const result = await callGemini(prompt);
    res.json({ prompt: result });
  } catch (err) {
    console.error('⚠️ journal-prompts fallback triggered:', err.message);
    res.json({
      prompt: "How are you feeling today, and why do you think you feel that way?"
    });
  }
});

// Motivation
router.post('/generate/motivation', async (req, res) => {
  try {
    const prompt = "Give a short, uplifting motivational quote for a college student who feels overwhelmed or self-doubting.";
    const result = await callGemini(prompt);
    res.json({ quote: result });
  } catch (err) {
    console.error('⚠️ motivation fallback triggered:', err.message);
    res.json({
      quote: "Keep going — you're stronger than you think."
    });
  }
});

// Empathetic Reply
router.post('/generate/empathetic-reply', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You're a friendly and supportive mental wellness chatbot. Respond empathetically to the following user message: "${message}"`;
    const result = await callGemini(prompt);
    res.json({ reply: result });
  } catch (err) {
    console.error('⚠️ empathetic-reply fallback triggered:', err.message);
    res.json({
      reply: "Servers are down but I'm still here for you. Sometimes just sharing how you feel can help. Click Journaling prompts for some offline journaling!"
    });
  }
});

module.exports = router;
