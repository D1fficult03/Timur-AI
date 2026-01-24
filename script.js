let chats = JSON.parse(localStorage.getItem("chats") || "[]");
let currentChat = null;

const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

function save() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

function renderChats() {
  chatList.innerHTML = "";
  chats.forEach((c, i) => {
    const div = document.createElement("div");
    div.textContent = c.title || "Новый чат";
    div.onclick = () => openChat(i);
    chatList.appendChild(div);
  });
}

function openChat(i) {
  currentChat = chats[i];
  messages.innerHTML = "";
  currentChat.messages.forEach(m => addMessage(m.text, m.role));
}

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

document.getElementById("newChat").onclick = () => {
  const chat = { title: "Новый чат", messages: [] };
  chats.unshift(chat);
  currentChat = chat;
  save();
  renderChats();
  messages.innerHTML = "";
};

form.onsubmit = async (e) => {
  e.preventDefault();
  if (!currentChat) return;

  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  currentChat.messages.push({ role: "user", text });
  addMessage(text, "user");

  const aiDiv = addMessage("", "ai");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: currentChat.messages })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let aiText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    aiText += decoder.decode(value);
    aiDiv.textContent = aiText;
  }

  currentChat.messages.push({ role: "ai", text: aiText });
  currentChat.title ||= text.slice(0, 20);
  save();
  renderChats();
};

renderChats();
