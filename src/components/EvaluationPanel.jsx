import { useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function EvaluationPanel({ documentId }) {
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  const runEvaluation = async () => {
    if (!documentId) {
      setError("Please select a document first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setEvaluation(null);

      const response = await fetch(
        `${API_BASE}/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: documentId,

            tests: [
              {
                query:
                  "What skills does Santosh have?",

                expected_facts: [
                  "Python",
                  "JavaScript",
                  "React.js",
                  "Vite",
                  "FastAPI",
                  "Supabase",
                  "PostgreSQL",
                  "Machine Learning",
                  "Groq",
                  "Recharts",
                  "Vercel",
                  "Render",
                  "Git",
                  "GitHub",
                ],

                expected_behavior: "answer",
              },

              {
                query:
                  "What projects has Santosh built?",

                expected_facts: [
                  "FinPilot AI",
                  "SalesPilot AI",
                  "NEET Learning Hub",
                  "InterviewAI",
                  "ProjectPilot AI",
                  "BizPilot AI",
                  "ExamPanic",
                ],

                expected_behavior: "answer",
              },

              {
                query:
                  "What is Santosh's favorite programming language?",

                expected_facts: [],

                expected_behavior: "not_found",
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Evaluation failed."
        );
      }

      setEvaluation(data);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="evaluation-card">

      {/* HEADER */}

      <div className="evaluation-header">

        <div>
          <span className="section-badge">
            RAG EVALUATION
          </span>

          <h2>
            Evaluate Your AI
          </h2>

          <p>
            Test retrieval quality and
            answer accuracy from your
            selected document.
          </p>
        </div>

        <button
          className="evaluate-button"
          onClick={runEvaluation}
          disabled={
            loading || !documentId
          }
        >
          {loading
            ? "Running Tests..."
            : "Run Evaluation 🚀"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="loading-box">
          🔍 Running RAG evaluation...
        </div>
      )}

      {/* RESULTS */}

      {evaluation && !loading && (

        <div className="evaluation-results">

          {/* METRICS */}

          <div className="evaluation-metrics">

            <div className="metric-card">
              <span>Accuracy</span>

              <strong>
                {evaluation.accuracy}%
              </strong>
            </div>

            <div className="metric-card">
              <span>
                Retrieval Success
              </span>

              <strong>
                {evaluation.retrieval_success_rate}%
              </strong>
            </div>

            <div className="metric-card">
              <span>
                Fact Coverage
              </span>

              <strong>
                {evaluation.answer_fact_coverage}%
              </strong>
            </div>

            <div className="metric-card">
              <span>
                Unsupported Query
              </span>

              <strong>
                {evaluation
                  .unsupported_query_accuracy !==
                null
                  ? `${evaluation.unsupported_query_accuracy}%`
                  : "N/A"}
              </strong>
            </div>

          </div>

          {/* SUMMARY */}

          <div className="evaluation-summary">

            <h3>
              Evaluation Summary
            </h3>

            <p>
              {evaluation.passed} of{" "}
              {evaluation.total_tests} tests
              passed successfully.
            </p>

          </div>

          {/* INDIVIDUAL TESTS */}

          <div className="evaluation-tests">

            <h3>
              Test Results
            </h3>

            {evaluation.results.map(
              (result) => (

                <div
                  className="evaluation-test"
                  key={result.test_number}
                >

                  <div className="test-header">

                    <strong>
                      Test {result.test_number}
                    </strong>

                    <span
                      className={
                        result.passed
                          ? "test-passed"
                          : "test-failed"
                      }
                    >
                      {result.passed
                        ? "✓ Passed"
                        : "✕ Failed"}
                    </span>

                  </div>

                  <p className="test-query">
                    {result.query}
                  </p>

                  <div className="test-details">

                    <span>
                      Retrieval:{" "}
                      {result
                        .retrieval_success
                        ? "✓"
                        : "✕"}
                    </span>

                    {result.top_similarity !==
                      null &&
                      result.top_similarity !==
                        undefined && (
                        <span>
                          Similarity:{" "}
                          {Math.round(
                            result.top_similarity *
                              100
                          )}
                          %
                        </span>
                      )}

                    {result.fact_coverage !==
                      null &&
                      result.fact_coverage !==
                        undefined && (
                        <span>
                          Fact Coverage:{" "}
                          {result.fact_coverage}%
                        </span>
                      )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}

    </section>
  );
}

export default EvaluationPanel;
