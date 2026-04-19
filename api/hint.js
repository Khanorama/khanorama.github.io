export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://leapcode.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { systemPrompt, userPrompt } = req.body;
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    }),
  });
  res.json(await r.json());
}