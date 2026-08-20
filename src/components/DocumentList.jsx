import { useEffect, useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentList({ selectedDocumentId, onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/documents`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load documents.");
      }

      setDocuments(data.documents || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const deleteDocument = async (documentId) => {
    const confirmed = window.confirm(
      "Delete this document?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete document."
        );
      }

      setDocuments((current) =>
        current.filter(
          (doc) => doc.id !== documentId
        )
      );

      if (selectedDocumentId === documentId) {
        onSelectDocument("");
      }

    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <section className="documents-card">
        <h2>📚 Your Documents</h2>
        <p>Loading documents...</p>
      </section>
    );
  }

  return (
    <section className="documents-card">

      <div className="documents-header">
        <div>
          <span className="section-badge">
            DOCUMENT LIBRARY
          </span>

          <h2>Your Documents</h2>

          <p>
            Select a document to start asking questions.
          </p>
        </div>

        <span className="document-count">
          {documents.length} documents
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="empty-documents">
          <div>📄</div>
          <h3>No documents yet</h3>
          <p>Upload a PDF to get started.</p>
        </div>
      ) : (
        <div className="document-list">

          {documents.map((document) => (
            <div
              className={`document-item ${
                selectedDocumentId === document.id
                  ? "selected"
                  : ""
              }`}
              key={document.id}
            >

              <div className="document-icon">
                📄
              </div>

              <div className="document-info">
                <strong>
                  {document.filename}
                </strong>

                <span>
                  {document.pages} page
                  {document.pages !== 1 ? "s" : ""} •{" "}
                  {document.chunks_count} chunks
                </span>
              </div>

              <div className="document-actions">

                <button
                  className="select-button"
                  onClick={() =>
                    onSelectDocument(document.id)
                  }
                >
                  {selectedDocumentId === document.id
                    ? "Selected ✓"
                    : "Select"}
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteDocument(document.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default DocumentList;
