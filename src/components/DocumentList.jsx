import { useEffect, useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentList({
  selectedDocumentId,
  onSelectDocument,
}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================

  const fetchDocuments = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_BASE}/documents`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load documents."
        );
      }

      setDocuments(data.documents || []);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong while loading documents."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =====================================================
  // DELETE DOCUMENT
  // =====================================================

  const deleteDocument = async (documentId) => {
    const document = documents.find(
      (doc) => doc.id === documentId
    );

    const filename =
      document?.filename || "this document";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(documentId);
      setError("");

      const response = await fetch(
        `${API_BASE}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete document."
        );
      }

      // Remove from UI immediately
      setDocuments((current) =>
        current.filter(
          (doc) => doc.id !== documentId
        )
      );

      // Clear active document
      if (
        selectedDocumentId === documentId
      ) {
        onSelectDocument("");
      }

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete document."
      );

    } finally {
      setDeletingId("");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="documents-card">

        <div className="documents-header">

          <div>
            <span className="section-badge">
              DOCUMENT LIBRARY
            </span>

            <h2>Your Documents</h2>

            <p>
              Loading your document library...
            </p>
          </div>

        </div>

        <div className="loading-box">
          🔄 Loading documents...
        </div>

      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="documents-card">

      {/* HEADER */}

      <div className="documents-header">

        <div>

          <span className="section-badge">
            DOCUMENT LIBRARY
          </span>

          <h2>Your Documents</h2>

          <p>
            Select a document to start asking
            questions.
          </p>

        </div>

        <div className="document-header-actions">

          <span className="document-count">
            {documents.length}{" "}
            {documents.length === 1
              ? "document"
              : "documents"}
          </span>

          <button
            className="refresh-button"
            onClick={() =>
              fetchDocuments(true)
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      {/* EMPTY */}

      {documents.length === 0 ? (
        <div className="empty-documents">

          <div className="empty-document-icon">
            📄
          </div>

          <h3>
            No documents yet
          </h3>

          <p>
            Upload a PDF to get started.
          </p>

        </div>
      ) : (

        /* DOCUMENT LIST */

        <div className="document-list">

          {documents.map((document) => {

            const isSelected =
              selectedDocumentId ===
              document.id;

            const isProcessing =
              document.status !==
              "completed";

            const isDeleting =
              deletingId ===
              document.id;

            return (

              <div
                className={`document-item ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                key={document.id}
              >

                {/* ICON */}

                <div className="document-icon">
                  📄
                </div>

                {/* INFO */}

                <div className="document-info">

                  <strong>
                    {document.filename}
                  </strong>

                  <span>
                    {document.pages}{" "}
                    {document.pages === 1
                      ? "page"
                      : "pages"}{" "}
                    •{" "}
                    {document.chunks_count}{" "}
                    chunks
                  </span>

                  {/* STATUS */}

                  <small
                    className={
                      document.status ===
                      "completed"
                        ? "document-ready"
                        : "document-processing"
                    }
                  >
                    {document.status ===
                    "completed"
                      ? "● Ready"
                      : `● ${document.status}`}
                  </small>

                </div>

                {/* ACTIONS */}

                <div className="document-actions">

                  {/* SELECT */}

                  <button
                    className="select-button"
                    disabled={
                      isProcessing ||
                      isDeleting
                    }
                    onClick={() =>
                      onSelectDocument(
                        document.id
                      )
                    }
                  >
                    {isSelected
                      ? "Active ✓"
                      : isProcessing
                      ? "Processing..."
                      : "Select"}
                  </button>

                  {/* DELETE */}

                  <button
                    className="delete-button"
                    disabled={isDeleting}
                    onClick={() =>
                      deleteDocument(
                        document.id
                      )
                    }
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default DocumentList;
