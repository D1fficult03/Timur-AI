export default async function handler(req, res) {
  const { message } = req.body;

  const r = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "Ты Timur AI, дружелюбный ассистент." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await r.json();
  res.json({ reply: data.choices[0].message.content });
}
