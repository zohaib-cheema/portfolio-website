/**
 * API endpoint to generate natural AI responses
 * POST /api/ai/generate-response
 * Uses Google Gemini API (free tier) or OpenAI as fallback
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, context } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Try Gemini API first (free tier available)
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate a brief, friendly, natural response (1-2 sentences) expressing interest in a meeting about "${topic}". Start with something like "A meeting about [topic] sounds" and keep it brief and friendly.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

          if (generatedText) {
            return res.status(200).json({
              success: true,
              response: generatedText,
            });
          }
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Fall through to OpenAI or template-based response
      }
    }

    // Try OpenAI API as fallback (if Gemini not available)
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant. Generate a brief, friendly, natural response (1-2 sentences) expressing interest in a meeting about a given topic. Keep it conversational and warm.'
              },
              {
                role: 'user',
                content: `Generate a natural response expressing interest in a meeting about "${topic}". Start with something like "A meeting about [topic] sounds" and keep it brief and friendly.`
              }
            ],
            max_tokens: 50,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.choices[0]?.message?.content?.trim();

          if (generatedText) {
            return res.status(200).json({
              success: true,
              response: generatedText,
            });
          }
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fall through to template-based response
      }
    }

    // Fallback: Generate natural response using templates
    const topicLower = topic.toLowerCase().trim();
    
    // Format the topic nicely
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    // Generate natural response
    const responses = [
      `A meeting about ${formattedTopic} sounds great!`,
      `That sounds interesting! A meeting about ${formattedTopic} would be wonderful.`,
      `Perfect! A meeting about ${formattedTopic} sounds like it could be really valuable.`,
      `A meeting about ${formattedTopic}? That sounds great!`,
      `I'd love to learn more! A meeting about ${formattedTopic} sounds like a good idea.`,
    ];

    // Pick a response based on topic hash for consistency
    const hash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedResponse = responses[hash % responses.length];

    return res.status(200).json({
      success: true,
      response: selectedResponse,
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
