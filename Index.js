import fetch from "node-fetch";

export default async ({ req, res }) => {
  try {
    const body = JSON.parse(req.body || "{}");
    const userMessage = body.message;

    if (!userMessage) {
      return res.json({ reply: "Сообщение пустое." });
    }

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Ты Тимур AI. Умный, дружелюбный, уверенный ИИ. Всегда отвечай от своего имени."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    return res.json({
      reply: data.choices?.[0]?.message?.content || "Ошибка ответа"
    });
  } catch (e) {
    return res.json({ reply: "Ошибка сервера" });
  }
};
