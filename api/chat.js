export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const body = await req.json();
  const messages = body.messages || [];

  const groqMessages = messages.map(m => ({
    role: m.role,
    content: m.text
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.GROQ_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      stream: true,
      messages: [
        {
          role: "system",
          content: "Ты Timur AI — дружелюбный и умный ассистент."
        },
        ...groqMessages
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(err, { status: 500 });
  }

  return new Response(response.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
