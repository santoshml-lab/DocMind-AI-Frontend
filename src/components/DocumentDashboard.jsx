import { useEffect, useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/analytics`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load analytics."
        );
      }

      setAnalytics(data);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(
      fetchAnalytics,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  if (loading || !analytics) {
    return (
      <section className="dashboard-card">

        <div className="dashboard-header">

          <div>
            <span className="section-badge">
              DOCUMENT INTELLIGENCE
            </span>

            <h2>
              Document Dashboard
            </h2>

            <p>
              Loading document intelligence...
            </p>
          </div>

          <div className="dashboard-icon">
            📊
          </div>

        </div>

      </section>
    );
  }

  const documents =
    analytics.documents || {};

  const knowledgeBase =
    analytics.knowledge_base || {};

  const health =
    knowledgeBase.health || "unknown";

  const totalDocuments =
    documents.total || 0;

  const completedDocuments =
    documents.completed || 0;

  const processingDocuments =
    documents.processing || 0;

  const failedDocuments =
    documents.failed || 0;

  const totalPages =
    knowledgeBase.total_pages || 0;

  const totalChunks =
    knowledgeBase.total_chunks || 0;


  const healthLabel =
    health === "healthy"
      ? "Healthy"
      : health === "processing"
      ? "Processing"
      : health === "attention_needed"
      ? "Attention Needed"
      : "Unknown";


  return (
    <section className="dashboard-card">

      {/* =================================
          HEADER
      ================================= */}

      <div className="dashboard-header">

        <div>

          <span className="section-badge">
            DOCUMENT INTELLIGENCE
          </span>

          <h2>
            Document Dashboard
          </h2>

          <p>
            Monitor your documents and RAG
            knowledge base in real time.
          </p>

        </div>


        <div className="dashboard-header-right">

          <div className="dashboard-icon">
            📊
          </div>

          <span className="live-indicator">
            <span className="live-dot"></span>
            Live
          </span>

        </div>

      </div>


      {/* =================================
          METRICS
      ================================= */}

      <div className="dashboard-metrics">


        <div className="dashboard-metric">

          <span>
            Total Documents
          </span>

          <strong>
            {totalDocuments}
          </strong>

          <small>
            Uploaded documents
          </small>

        </div>


        <div className="dashboard-metric">

          <span>
            Ready
          </span>

          <strong>
            {completedDocuments}
          </strong>

          <small>
            Completed documents
          </small>

        </div>


        <div className="dashboard-metric">

          <span>
            Processing
          </span>

          <strong>
            {processingDocuments}
          </strong>

          <small>
            Currently processing
          </small>

        </div>


        <div className="dashboard-metric">

          <span>
            Total Chunks
          </span>

          <strong>
            {totalChunks}
          </strong>

          <small>
            RAG knowledge units
          </small>

        </div>

      </div>


      {/* =================================
          KNOWLEDGE BASE HEALTH
      ================================= */}

      <div className="dashboard-health">

        <div>

          <span className="health-label">
            Knowledge Base
          </span>

          <strong>
            {totalPages} Pages
            {" • "}
            {totalChunks} Chunks
          </strong>

          <small>
            Vector knowledge base status
          </small>

        </div>


        <div
          className={`health-status ${health}`}
        >

          <span className="health-dot"></span>

          {healthLabel}

        </div>

      </div>


      {/* =================================
          SYSTEM SUMMARY
      ================================= */}

      <div className="dashboard-summary">

        <div className="summary-item">

          <span>
            Documents indexed
          </span>

          <strong>
            {completedDocuments}
            {" / "}
            {totalDocuments}
          </strong>

        </div>


        <div className="summary-item">

          <span>
            Pages indexed
          </span>

          <strong>
            {totalPages}
          </strong>

        </div>


        <div className="summary-item">

          <span>
            RAG chunks
          </span>

          <strong>
            {totalChunks}
          </strong>

        </div>


        <div className="summary-item">

          <span>
            Failed
          </span>

          <strong>
            {failedDocuments}
          </strong>

        </div>

      </div>


      {/* =================================
          WARNING
      ================================= */}

      {failedDocuments > 0 && (

        <div className="dashboard-warning">

          <span>
            ⚠️
          </span>

          <span>
            {failedDocuments} document
            {failedDocuments !== 1
              ? "s"
              : ""} failed to process.
          </span>

        </div>

      )}


      {/* =================================
          FOOTER
      ================================= */}

      <div className="dashboard-footer">

        <span>
          RAG knowledge base monitoring
        </span>

        {lastUpdated && (

          <span>
            Updated{" "}
            {lastUpdated.toLocaleTimeString()}
          </span>

        )}

      </div>

    </section>
  );
}

export default DocumentDashboard;
