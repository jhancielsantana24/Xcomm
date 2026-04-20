const initialMessages = [
  {
    id: crypto.randomUUID(),
    author: "Ava",
    text: "Welcome to Xcomm! Share your ideas for the next community update.",
    time: "just now",
    replies: [
      {
        id: crypto.randomUUID(),
        author: "Leo",
        text: "Would love better topic filters and announcement tags.",
        time: "1m ago",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    author: "Mira",
    text: "The new live communication feed looks amazing in dark mode.",
    time: "2m ago",
    replies: [],
  },
];

const state = {
  messages: [...initialMessages],
  replyTo: null,
};

const conversation = document.getElementById("conversation");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const activeUsers = ["Ava Chen", "Noah Patel", "Mia Alvarez", "Ethan Brooks", "Luna Park"];
const feedEvents = [
  "Noah posted in Product News",
  "Ava started a thread in Innovation Lab",
  "Mia reacted to roadmap announcement",
  "Ethan joined Community Lounge",
  "Luna shared a new event reminder",
];

function renderMessages() {
  conversation.innerHTML = "";

  state.messages.forEach((msg) => {
    const item = createMessageElement(msg);
    conversation.appendChild(item);

    msg.replies.forEach((reply) => {
      const replyEl = createMessageElement(reply, true);
      conversation.appendChild(replyEl);
    });
  });

  conversation.scrollTop = conversation.scrollHeight;
}

function createMessageElement(message, isReply = false) {
  const wrapper = document.createElement("article");
  wrapper.className = `msg ${isReply ? "reply" : ""}`;
  const initials = message.author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  wrapper.innerHTML = `
    <div class="avatar">${initials}</div>
    <div class="msg-body">
      <strong>${message.author}</strong>
      <small> · ${message.time}</small>
      <p>${message.text}</p>
      ${
        !isReply
          ? `<button class="reply-btn" data-reply-id="${message.id}">Reply</button>`
          : ""
      }
    </div>
  `;
  return wrapper;
}

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  if (state.replyTo) {
    const parent = state.messages.find((m) => m.id === state.replyTo);
    if (parent) {
      parent.replies.push({
        id: crypto.randomUUID(),
        author: "You",
        text,
        time: "now",
      });
    }
    state.replyTo = null;
    messageInput.placeholder = "Share an announcement or idea...";
  } else {
    state.messages.push({
      id: crypto.randomUUID(),
      author: "You",
      text,
      time: "now",
      replies: [],
    });
  }

  messageInput.value = "";
  renderMessages();
});

conversation.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const id = target.dataset.replyId;
  if (!id) return;

  state.replyTo = id;
  messageInput.focus();
  messageInput.placeholder = "Write a reply and press Send...";
});

function seedParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 38; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.bottom = `${Math.random() * 10 - 10}%`;
    dot.style.animationDuration = `${8 + Math.random() * 10}s`;
    dot.style.animationDelay = `${Math.random() * 8}s`;
    particlesContainer.appendChild(dot);
  }
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupLivePanels() {
  const usersEl = document.getElementById("active-users");
  const feedEl = document.getElementById("live-feed");

  activeUsers.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user} · online`;
    usersEl.appendChild(li);
  });

  function addFeedItem(text) {
    const item = document.createElement("article");
    item.className = "feed-item";
    item.textContent = `${text} · ${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    feedEl.prepend(item);

    if (feedEl.children.length > 8) {
      feedEl.removeChild(feedEl.lastElementChild);
    }
  }

  feedEvents.forEach((event) => addFeedItem(event));

  setInterval(() => {
    const randomEvent = feedEvents[Math.floor(Math.random() * feedEvents.length)];
    addFeedItem(randomEvent);
  }, 3800);
}

window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.22;
  document.querySelector(".hero-lights").style.transform = `translateY(${offset}px)`;
});

renderMessages();
seedParticles();
setupReveal();
setupLivePanels();
