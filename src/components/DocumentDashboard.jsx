import { useEffect, useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function DocumentDashboard() {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {

    try {

      setLoading(true);

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

    } finally {

      setLoading(false);

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


  const totalChunks =
    documents.reduce(
      (total, doc) =>
        total +
        Number(doc.chunks_count || 0),
      0
    );


  if (loading) {

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

          </div>

        </div>

        <div className="dashboard-loading">
          Loading document intelligence...
        </div>

      </section>

    );

  }


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
            Monitor your documents and
            RAG knowledge base.
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
            {totalDocuments}
          </strong>

          <small>
            Uploaded files
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


      {/* RECENT DOCUMENTS */}

      <div className="dashboard-documents">

        <div className="dashboard-section-header">

          <h3>
            Recent Documents
          </h3>

          <span>
            {documents.length} total
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
              Upload a PDF to build
              your knowledge base.
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
