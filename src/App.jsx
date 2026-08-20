import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

function App() {
  const [document, setDocument] = useState(null);

  return (
    <>
      <UploadBox onUploadSuccess={setDocument} />

      {document && (
        <section className="document-card">
          <div className="document-icon">📄</div>

          <div className="document-info">
            <div className="document-header">
              <h2>Document Ready</h2>
              <span className="ready-badge">● Ready</span>
            </div>

            <p className="document-name">
              {document.filename}
            </p>

            <div className="document-stats">
              <div>
                <span>Pages</span>
                <strong>{document.pages}</strong>
              </div>

              <div>
                <span>Chunks</span>
                <strong>{document.chunks_count}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Completed</strong>
              </div>
            </div>

            <p className="document-id">
              Document ID: {document.document_id}
            </p>
          </div>
        </section>
      )}

      <ChatBox
        documentId={document?.document_id || ""}
      />
    </>
  );
}

export default App;
