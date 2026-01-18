export default async ({ req, res }) => {
  try {
    const body = req.body || {};
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      return res.json({ reply: "Сообщение пустое" });
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Ты — Тимур. Отвечай мягко и мило, как няшная тянка из дискорда. Можно использовать лёгкие выражения, но избегай грубых слов и оскорблений. Держи тон дружелюбным и вежливым.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    // Если ответ не OK
    if (!response.ok) {
      const errText = await response.text();
      return res.json({
        reply: "Ошибка от сервера Deepseek",
        error: errText,
      });
    }

    const data = await response.json();

    return res.json({
      reply: data.choices?.[0]?.message?.content || "Нет ответа от ИИ",
    });
  } catch (e) {
    return res.json({
      reply: "Ошибка сервера",
      error: e.message,
    });
  }
};
