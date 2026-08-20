import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

function App() {
  const [document, setDocument] = useState(null);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          DocMind AI
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI Document Assistant
        </div>
      </nav>

      <main className="main-container">

        {/* HERO */}
        <section className="hero">

          <div className="hero-badge">
            AI • RAG • DOCUMENT INTELLIGENCE
          </div>

          <h1>
            Ask Anything.
            <br />
            From Your Documents.
          </h1>

          <p>
            Upload your PDF and let DocMind AI understand,
            search and answer questions from your documents.
          </p>

        </section>

        {/* UPLOAD */}
        <UploadBox
          onUploadSuccess={setDocument}
        />

        {/* DOCUMENT INFO */}
        {document && (
          <section className="document-card">

            <div className="document-icon">
              📄
            </div>

            <div className="document-info">

              <div className="document-header">
                <h2>Document Ready</h2>

                <span className="ready-badge">
                  ● Ready
                </span>
              </div>

              <p className="document-name">
                {document.filename}
              </p>

              <div className="document-stats">

                <div>
                  <span>Pages</span>
                  <strong>
                    {document.pages}
                  </strong>
                </div>

                <div>
                  <span>Chunks</span>
                  <strong>
                    {document.chunks_count}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    Completed
                  </strong>
                </div>

              </div>

              <p className="document-id">
                Document ID: {document.document_id}
              </p>

            </div>

          </section>
        )}

        {/* CHAT */}
        <ChatBox
          documentId={
            document?.document_id || ""
          }
        />

      </main>
    </>
  );
}

export default App;
