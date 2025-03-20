const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Initialize chat history
let chatHistory = [];

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY =
  "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"; // Store this securely in environment variables in production

// Initialize markdown-it
const md = window.markdownit({
  html: false, // Disable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URLs into links
  typographer: true, // Enable smartquotes and other typographic replacements
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  },
});

async function getAIResponse(userMessage) {
  try {
    // Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful travel assistant. Provide concise travel suggestions and information.
Please format your responses using Markdown. You can use:
- **bold** for emphasis
- *italics* for subtle emphasis
- # Headings (h1-h6)
- Bullet points and numbered lists
- [links](URL)
- \`code\` for specific terms
- > blockquotes for important information
Keep responses informative but concise.`,
          },
          ...chatHistory,
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Add AI response to history
    chatHistory.push({ role: "assistant", content: aiResponse });

    // Keep history limited to last 10 messages to prevent token limit issues
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    return aiResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Debounce function to prevent rapid-fire API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  try {
    // Disable input and button while processing
    userInput.value = "";
    userInput.disabled = true;
    sendButton.disabled = true;

    addMessage(userMessage, true);

    const loadingMessage = addMessage("Thinking...");

    const aiResponse = await getAIResponse(userMessage);

    // Remove loading message and add AI response
    loadingMessage.remove();
    addMessage(aiResponse);
  } catch (error) {
    addMessage("Sorry, I encountered an error. Please try again later.");
  } finally {
    // Re-enable input and button
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(isUser ? "user-message" : "bot-message");

  // Convert markdown to HTML if it's a bot message
  if (!isUser) {
    // Process markdown content
    const htmlContent = md.render(content);
    messageDiv.innerHTML = htmlContent;

    // Make links open in new tab
    const links = messageDiv.getElementsByTagName("a");
    for (let link of links) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  } else {
    // For user messages, just escape HTML
    messageDiv.textContent = content;
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageDiv;
}

// Event listeners with debounced handler
const debouncedHandler = debounce(handleUserInput, 300);
sendButton.addEventListener("click", debouncedHandler);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    debouncedHandler();
  }
});
// Initial greeting
addMessage("Hello! I'm your Travel Buddy. Where would you like to go?");
