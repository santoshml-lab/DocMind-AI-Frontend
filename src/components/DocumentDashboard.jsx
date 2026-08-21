import { useEffect, useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

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

    } catch (error) {
      console.error(
        "Analytics error:",
        error
      );
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

  return (
    <section className="dashboard-card">

      {/* HEADER */}

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

        <div className="dashboard-icon">
          📊
        </div>

      </div>


      {/* METRICS */}

      <div className="dashboard-metrics">

        <div className="dashboard-metric">

          <span>
            Total Documents
          </span>

          <strong>
            {documents.total || 0}
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
            {documents.completed || 0}
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
            {documents.processing || 0}
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
            {knowledgeBase.total_chunks || 0}
          </strong>

          <small>
            RAG knowledge units
          </small>

        </div>

      </div>


      {/* KNOWLEDGE BASE */}

      <div className="dashboard-health">

        <div>

          <span className="health-label">
            Knowledge Base
          </span>

          <strong>
            {knowledgeBase.total_pages || 0} Pages
            {" • "}
            {knowledgeBase.total_chunks || 0} Chunks
          </strong>

        </div>


        <div
          className={`health-status ${health}`}
        >

          <span className="health-dot"></span>

          {health === "healthy"
            ? "Healthy"
            : health === "processing"
            ? "Processing"
            : health === "attention_needed"
            ? "Attention Needed"
            : "Unknown"}

        </div>

      </div>


      {/* FAILED DOCUMENTS */}

      {(documents.failed || 0) > 0 && (

        <div className="dashboard-warning">

          ⚠️

          <span>
            {documents.failed} document
            {documents.failed !== 1
              ? "s"
              : ""} failed to process.
          </span>

        </div>

      )}

    </section>
  );
}

export default DocumentDashboard;
