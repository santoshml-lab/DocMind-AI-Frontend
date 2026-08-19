import { useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function ChatBox() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askDocument = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-card">
      <h2>Ask Your Document</h2>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask something about your document..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askDocument();
            }
          }}
        />

        <button
          onClick={askDocument}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask 🤖"}
        </button>
      </div>

      {answer && (
        <div className="answer-box">
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </section>
  );
}

export default ChatBox;
