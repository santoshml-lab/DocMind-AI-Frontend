
import { useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function ChatBox({ documentId }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const askDocument = async () => {
    if (!query.trim()) {
      return;
    }

    if (!documentId) {
      setAnswer("Please upload a document first.");
      setSources([]);
      return;
    }

    try {
      setLoading(true);
      setAnswer("");
      setSources([]);

      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          query: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch (error) {
      setAnswer(`Error: ${error.message}`);
      setSources([]);
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

          {sources.length > 0 && (
            <div className="sources-box">
              <h3>📚 Sources</h3>

              {sources.map((source, index) => {
                const similarity = Number(source.similarity);

                return (
                  <div className="source-item" key={index}>
                    <div className="source-file">
                      📄 {source.filename}
                    </div>

                    <div className="source-meta">
                      <span>
                        Chunk {source.chunk_index}
                      </span>

                      {Number.isFinite(similarity) && (
                        <span>
                          {Math.round(similarity * 100)}% match
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ChatBox;
