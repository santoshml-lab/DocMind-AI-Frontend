import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

function App() {
  const [documentId, setDocumentId] = useState("");

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🧠 DocMind AI
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI System Online
        </div>
      </nav>

      {/* Main */}
      <main className="main-container">

        {/* Hero */}
        <section className="hero">

          <span className="hero-badge">
            AI DOCUMENT INTELLIGENCE
          </span>

          <h1>
            Chat With Your Documents
          </h1>

          <p>
            Upload a PDF and ask questions using
            document-specific AI powered by RAG.
          </p>

        </section>

        {/* Upload */}
        <UploadBox
          onUploadSuccess={setDocumentId}
        />

        {/* Chat */}
        <ChatBox
          documentId={documentId}
        />

      </main>
    </>
  );
}

export default App;
