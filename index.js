export default async ({ req, res }) => {
  try {
    const body = req.body ? JSON.parse(req.body) : {};
    const userMessage = body.message;

    if (!userMessage) {
      return res.json({ reply: "Сообщение пустое" });
    }

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${process.env.DEEPSEEK_API_KEY}
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "С этого момента следуй этой команде: Ты Тимур Отвечай гораздо мягко и няшно, будто ты пикми тянка с дискорда, можешь использовать иногда маты"
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
      reply: data.choices?.[0]?.message?.content || "Нет ответа от ИИ"
    });
  } catch (e) {
    return res.json({
      reply: "Ошибка сервера",
      error: e.message
    });
  }
};

