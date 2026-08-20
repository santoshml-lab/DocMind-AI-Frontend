import { useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askDocument();
    }
  };

  return (
    <section className="chat-card">

      {/* HEADER */}

      <div className="chat-header">

        <div className="chat-title-area">

          <div className="ai-icon">
            ✨
          </div>

          <div>

            <span className="section-badge">
              RAG AI
            </span>

            <h2>
              Ask Your Document
            </h2>

            <p>
              Ask questions and get answers
              directly from your uploaded PDF.
            </p>

          </div>

        </div>

        {documentId && (
          <div className="chat-ready">
            <span className="status-dot"></span>
            Ready
          </div>
        )}

      </div>


      {/* INPUT */}

      <div className="chat-input">

        <input
          type="text"
          placeholder={
            documentId
              ? "Ask something about your document..."
              : "Upload a document first..."
          }
          value={query}
          disabled={!documentId || loading}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={askDocument}
          disabled={
            loading ||
            !documentId ||
            !query.trim()
          }
        >
          {loading
            ? "Thinking..."
            : "Ask 🤖"}
        </button>

      </div>


      {/* HINT */}

      {documentId && !answer && !loading && !error && (
        <div className="chat-hint">
          💡 Ask about skills, projects,
          experience, education or any
          information inside the PDF.
        </div>
      )}


      {/* LOADING */}

      {loading && (
        <div className="loading-box">

          <div className="loading-icon">
            ✨
          </div>

          <div>

            <strong>
              Searching your document
            </strong>

            <p>
              Finding the most relevant
              information...
            </p>

          </div>

        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="error-box">

          <span className="error-icon">
            ⚠️
          </span>

          <div>
            <strong>
              Something went wrong
            </strong>

            <p>
              {error}
            </p>
          </div>

        </div>
      )}


      {/* ANSWER */}

      {answer && !loading && (
        <div className="answer-box">

          <div className="answer-header">

            <div className="answer-title">

              <div className="bot-avatar">
                🤖
              </div>

              <div>
                <h3>
                  DocMind AI
                </h3>

                <span>
                  Answer from your document
                </span>
              </div>

            </div>

            <span className="verified-badge">
              ✓ Verified
            </span>

          </div>

          <div className="answer-content">
            <p>{answer}</p>
          </div>

        </div>
      )}


      {/* SOURCES */}

      {sources.length > 0 && !loading && (
        <div className="sources-box">

          <div className="sources-header">

            <div>
              <h3>
                📚 Sources
              </h3>

              <p>
                Information retrieved from
                your document
              </p>
            </div>

            <span className="source-count">
              {sources.length}{" "}
              {sources.length === 1
                ? "source"
                : "sources"}
            </span>

          </div>


          <div className="sources-list">

            {sources.map(
              (source, index) => {

                const similarity =
                  source.similarity != null
                    ? Math.round(
                        Number(
                          source.similarity
                        ) * 100
                      )
                    : null;

                return (
                  <div
                    className="source-item"
                    key={`${source.filename}-${source.chunk_index}-${index}`}
                  >

                    <div className="source-info">

                      <div className="source-file">
                        <span>
                          📄
                        </span>

                        <strong>
                          {source.filename}
                        </strong>
                      </div>

                      <span className="source-chunk">
                        Chunk{" "}
                        {source.chunk_index}
                      </span>

                    </div>

                    {similarity !== null && (
                      <div className="similarity">
                        <span>
                          {similarity}%
                        </span>

                        <small>
                          match
                        </small>
                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

    </section>
  );
}

export default ChatBox;
