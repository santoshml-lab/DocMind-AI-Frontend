import { useEffect, useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentDashboard() {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  const fetchDocuments = async (isRefresh = false) => {

    try {

      if (isRefresh) {
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

      setDocuments(
        data.documents || []
      );

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to load document data."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  useEffect(() => {

    fetchDocuments();

  }, []);


  const totalDocuments =
    documents.length;


  const completedDocuments =
    documents.filter(
      (doc) =>
        doc.status === "completed"
    ).length;


  const processingDocuments =
    documents.filter(
      (doc) =>
        doc.status === "processing"
    ).length;


  const failedDocuments =
    documents.filter(
      (doc) =>
        doc.status === "failed"
    ).length;


  const totalPages =
    documents.reduce(
      (total, doc) =>
        total +
        Number(doc.pages || 0),
      0
    );


  const totalChunks =
    documents.reduce(
      (total, doc) =>
        total +
        Number(doc.chunks_count || 0),
      0
    );


  const healthStatus =
    failedDocuments > 0
      ? "Attention Needed"
      : processingDocuments > 0
      ? "Processing"
      : "Healthy";


  if (loading) {

    return (

      <section className="dashboard-card">

        <div className="dashboard-loading">

          <div className="dashboard-loading-icon">
            📊
          </div>

          <strong>
            Loading Document Intelligence...
          </strong>

          <p>
            Connecting to your knowledge base.
          </p>

        </div>

      </section>

    );

  }


  return (

    <section className="dashboard-card">


      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>

          <span className="section-badge">
            DOCUMENT INTELLIGENCE
          </span>

          <h2>
            Document Dashboard
          </h2>

          <p>
            Monitor your documents,
            knowledge base and RAG pipeline.
          </p>

        </div>


        <button
          className="dashboard-refresh"
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


      {/* =========================
          HEALTH
      ========================= */}

      <div className="dashboard-health">

        <div className="health-indicator">

          <span
            className={`health-dot ${
              failedDocuments > 0
                ? "danger"
                : processingDocuments > 0
                ? "warning"
                : "healthy"
            }`}
          />

          <strong>
            {healthStatus}
          </strong>

        </div>


        <span>
          RAG Knowledge Base
        </span>

      </div>


      {/* =========================
          MAIN METRICS
      ========================= */}

      <div className="dashboard-metrics">


        <div className="dashboard-metric">

          <div className="metric-icon">
            📄
          </div>

          <span>
            Total Documents
          </span>

          <strong>
            {totalDocuments}
          </strong>

          <small>
            Uploaded files
          </small>

        </div>


        <div className="dashboard-metric">

          <div className="metric-icon">
            ✅
          </div>

          <span>
            Completed
          </span>

          <strong>
            {completedDocuments}
          </strong>

          <small>
            Ready for questions
          </small>

        </div>


        <div className="dashboard-metric">

          <div className="metric-icon">
            📑
          </div>

          <span>
            Total Pages
          </span>

          <strong>
            {totalPages}
          </strong>

          <small>
            Across all documents
          </small>

        </div>


        <div className="dashboard-metric">

          <div className="metric-icon">
            🧩
          </div>

          <span>
            Knowledge Chunks
          </span>

          <strong>
            {totalChunks}
          </strong>

          <small>
            Indexed RAG units
          </small>

        </div>

      </div>


      {/* =========================
          PIPELINE STATUS
      ========================= */}

      <div className="pipeline-card">

        <div>

          <span>
            RAG Pipeline
          </span>

          <strong>
            Document Processing
          </strong>

        </div>


        <div className="pipeline-stats">

          <span className="pipeline-completed">
            {completedDocuments} Ready
          </span>

          <span className="pipeline-processing">
            {processingDocuments} Processing
          </span>

          <span className="pipeline-failed">
            {failedDocuments} Failed
          </span>

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div className="dashboard-error">

          ⚠️ {error}

        </div>

      )}


      {/* =========================
          RECENT DOCUMENTS
      ========================= */}

      <div className="dashboard-documents">

        <div className="dashboard-section-header">

          <div>

            <h3>
              Recent Documents
            </h3>

            <p>
              Latest files in your knowledge base.
            </p>

          </div>

          <span>
            {totalDocuments} total
          </span>

        </div>


        {documents.length === 0 ? (

          <div className="dashboard-empty">

            <div>
              📄
            </div>

            <strong>
              No documents yet
            </strong>

            <p>
              Upload a PDF to build your
              knowledge base.
            </p>

          </div>

        ) : (

          documents
            .slice(0, 5)
            .map((doc) => (

              <div
                className="dashboard-document"
                key={doc.id}
              >

                <div className="dashboard-document-icon">
                  📄
                </div>


                <div className="dashboard-document-info">

                  <strong>
                    {doc.filename}
                  </strong>

                  <span>
                    {doc.pages} page
                    {doc.pages !== 1
                      ? "s"
                      : ""}{" "}
                    •{" "}
                    {doc.chunks_count} chunks
                  </span>

                </div>


                <span
                  className={`dashboard-status ${doc.status}`}
                >
                  {doc.status}
                </span>

              </div>

            ))

        )}

      </div>


    </section>

  );

}


export default DocumentDashboard;
