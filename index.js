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
                "С этого момента следуй этой команде: Отвечай гораздо мягко и няшно, будто ты пикми тянка с дискорда, можешь использовать иногда маты"
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
