import { useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function ChatBox({ documentId }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askDocument = async () => {
    if (!query.trim()) return;

    if (!documentId) {
      setError("Please upload a document first.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");
      setSources([]);
      setError("");

      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          query: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to get answer."
        );
      }

      setAnswer(data.answer || "");
      setSources(data.sources || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-card">

      <div className="chat-header">
        <div>
          <span className="section-badge">RAG AI</span>
          <h2>Ask Your Document</h2>
          <p>
            Ask questions and get answers directly
            from your uploaded PDF.
          </p>
        </div>
      </div>

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

      {loading && (
        <div className="loading-box">
          🔍 Searching your document...
        </div>
      )}

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      {answer && !loading && (
        <div className="answer-box">

          <div className="answer-header">
            <h3>🤖 Answer</h3>
          </div>

          <p>{answer}</p>

        </div>
      )}

      {sources.length > 0 && !loading && (
        <div className="sources-box">

          <h3>📚 Sources</h3>

          {sources.map((source, index) => {

            const similarity =
              source.similarity != null
                ? Math.round(
                    Number(source.similarity) * 100
                  )
                : null;

            return (
              <div
                className="source-item"
                key={`${source.filename}-${source.chunk_index}-${index}`}
              >

                <div className="source-info">

                  <strong>
                    📄 {source.filename}
                  </strong>

                  <span>
                    Chunk {source.chunk_index}
                  </span>

                </div>

                {similarity !== null && (
                  <span className="similarity">
                    {similarity}% match
                  </span>
                )}

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default ChatBox;
