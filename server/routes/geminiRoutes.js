const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(promptText) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}`,
      {
        contents: [{ parts: [{ text: promptText }] }]
      },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 seconds
      }
    );
    console.log('Gemini raw response:', JSON.stringify(response.data, null, 2));
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
    console.error('Gemini API error (journal-prompts):', err);
    // Fallback prompt
    res.json({ prompt: "How are you feeling today, and why do you think you feel that way?" });
  }
});

// Motivation
router.post('/generate/motivation', async (req, res) => {
  try {
    const prompt = "Give a short, uplifting motivational quote for a college student who feels overwhelmed or self-doubting.";
    const result = await callGemini(prompt);
    res.json({ quote: result });
  } catch (err) {
    console.error('Gemini API error (motivation):', err);
    // Fallback quote
    res.json({ quote: "Keep going — you're stronger than you think." });
  }
});

// Empathetic Reply
router.post('/generate/empathetic-reply', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Reply empathetically and supportively to this message from a student: '${message}'\nResponse should be under 30 words, comforting, and natural.`;
    const result = await callGemini(prompt);
    res.json({ quote: result });
  } catch (err) {
    res.status(502).json({ error: 'Failed to connect to Gemini API' });
  }
});

module.exports = router;