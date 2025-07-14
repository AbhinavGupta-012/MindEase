const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(promptText) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }]
      }
    );
    console.log('Gemini raw response:', JSON.stringify(response.data, null, 2));
    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    throw new Error('Gemini API error');
  }
}

// Journal Prompts
router.post('/generate/journal-prompts', async (req, res) => {
  try {
    const prompt = "Generate 3 short, reflective journaling prompts to help a college student manage stress and anxiety.";
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate journal prompts.' });
  }
});

// Motivation
router.post('/generate/motivation', async (req, res) => {
  try {
    const prompt = "Give a short, uplifting motivational quote for a college student who feels overwhelmed or self-doubting.";
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate motivation.' });
  }
});

// Empathetic Reply
router.post('/generate/empathetic-reply', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Reply empathetically and supportively to this message from a student: '${message}'\nResponse should be under 30 words, comforting, and natural.`;
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate empathetic reply.' });
  }
});

module.exports = router;