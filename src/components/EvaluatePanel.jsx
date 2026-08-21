import { useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function EvaluatePanel({ documentId }) {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runEvaluation = async () => {

    if (!documentId) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const tests = [

      {
        query: "What skills does Santosh have?",

        expected_facts: [
          "Python",
          "JavaScript",
          "React.js",
          "FastAPI",
          "Machine Learning",
          "Groq",
          "Git",
          "GitHub"
        ],

        expected_behavior: "answer"
      },

      {
        query: "What projects has Santosh built?",

        expected_facts: [
          "FinPilot AI",
          "SalesPilot AI",
          "NEET Learning Hub",
          "InterviewAI",
          "ProjectPilot AI",
          "BizPilot AI",
          "ExamPanic"
        ],

        expected_behavior: "answer"
      },

      {
        query:
          "What is Santosh's favorite programming language?",

        expected_facts: [],

        expected_behavior: "not_found"
      }

    ];

    try {

      const response = await fetch(
        `${API_BASE}/evaluate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            document_id: documentId,
            tests
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Evaluation failed."
        );
      }

      setResult(data);

    } catch (error) {

      setError(error.message);

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
            AI Quality Check
          </h2>

          <p>
            Test retrieval accuracy and answer
            quality for the selected document.
          </p>

        </div>

        <div className="evaluation-icon">
          🧪
        </div>

      </div>


      {/* RUN BUTTON */}

      <button
        className="evaluate-button"
        onClick={runEvaluation}
        disabled={loading || !documentId}
      >

        {loading
          ? "Running Evaluation..."
          : "Run Evaluation 🚀"}

      </button>


      {/* ERROR */}

      {error && (

        <div className="evaluation-error">
          ⚠️ {error}
        </div>

      )}


      {/* RESULTS */}

      {result && (

        <>

          {/* METRICS */}

          <div className="evaluation-metrics">

            <div className="metric-card">

              <span>
                Accuracy
              </span>

              <strong>
                {result.accuracy}%
              </strong>

              <small>
                Overall test accuracy
              </small>

            </div>


            <div className="metric-card">

              <span>
                Retrieval
              </span>

              <strong>
                {result.retrieval_success_rate}%
              </strong>

              <small>
                Successful retrievals
              </small>

            </div>


            <div className="metric-card">

              <span>
                Fact Coverage
              </span>

              <strong>
                {result.answer_fact_coverage}%
              </strong>

              <small>
                Expected facts matched
              </small>

            </div>


            <div className="metric-card">

              <span>
                Not Found
              </span>

              <strong>
                {result.unsupported_query_accuracy ?? "—"}%
              </strong>

              <small>
                Unsupported query accuracy
              </small>

            </div>

          </div>


          {/* TEST SUMMARY */}

          <div className="evaluation-summary">

            <div>

              <span>
                Tests
              </span>

              <strong>
                {result.total_tests}
              </strong>

            </div>


            <div className="passed">

              <span>
                Passed
              </span>

              <strong>
                {result.passed}
              </strong>

            </div>


            <div className="failed">

              <span>
                Failed
              </span>

              <strong>
                {result.failed}
              </strong>

            </div>

          </div>


          {/* TEST RESULTS */}

          <div className="evaluation-tests">

            <h3>
              Test Results
            </h3>


            {result.results?.map(
              (test) => (

                <div
                  className={`evaluation-test ${
                    test.passed
                      ? "test-passed"
                      : "test-failed"
                  }`}
                  key={test.test_number}
                >

                  <div className="test-top">

                    <strong>
                      Test {test.test_number}
                    </strong>

                    <span>
                      {test.passed
                        ? "✓ Passed"
                        : "✕ Failed"}
                    </span>

                  </div>


                  <p className="test-question">
                    {test.query}
                  </p>


                  {test.top_similarity != null && (

                    <div className="test-similarity">

                      Retrieval similarity:

                      <strong>
                        {" "}
                        {Math.round(
                          test.top_similarity * 100
                        )}%
                      </strong>

                    </div>

                  )}


                  <div className="test-answer">

                    <span>
                      Answer
                    </span>

                    <p>
                      {test.answer}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </>

      )}

    </section>

  );
}

export default EvaluatePanel;
