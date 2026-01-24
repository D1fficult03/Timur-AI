export const config = { runtime: "edge" };

export default async function handler(req) {
  const { messages } = await req.json();

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      stream: true,
      messages: [
        { role: "system", content: "Ты Timur AI, умный и дружелюбный ассистент." },
        ...messages
      ]
    })
  });

  return new Response(response.body, {
    headers: { "Content-Type": "text/plain" }
  });
}
