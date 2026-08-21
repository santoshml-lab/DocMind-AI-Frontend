import { useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function EvaluatePanel({ documentId }) {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [tests, setTests] = useState([
    {
      query: "What skills does Santosh have?",
      expected_facts:
        "Python, JavaScript, React.js, FastAPI",
      expected_behavior: "answer"
    },
    {
      query: "What projects has Santosh built?",
      expected_facts:
        "SalesPilot AI, NEET Learning Hub, InterviewAI",
      expected_behavior: "answer"
    },
    {
      query:
        "What is Santosh's favorite programming language?",
      expected_facts: "",
      expected_behavior: "not_found"
    }
  ]);


  // ==========================================
  // UPDATE TEST
  // ==========================================

  const updateTest = (
    index,
    field,
    value
  ) => {

    setTests((current) =>
      current.map((test, i) =>
        i === index
          ? {
              ...test,
              [field]: value
            }
          : test
      )
    );
  };


  // ==========================================
  // ADD TEST
  // ==========================================

  const addTest = () => {

    setTests((current) => [
      ...current,
      {
        query: "",
        expected_facts: "",
        expected_behavior: "answer"
      }
    ]);

  };


  // ==========================================
  // REMOVE TEST
  // ==========================================

  const removeTest = (index) => {

    setTests((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );

  };


  // ==========================================
  // RUN EVALUATION
  // ==========================================

  const runEvaluation = async () => {

    if (!documentId) {

      setError(
        "Please select a document first."
      );

      return;
    }


    const validTests = tests.filter(
      (test) =>
        test.query.trim()
    );


    if (!validTests.length) {

      setError(
        "Please add at least one test question."
      );

      return;
    }


    setLoading(true);
    setError("");
    setResult(null);


    const formattedTests =
      validTests.map((test) => ({

        query:
          test.query.trim(),

        expected_facts:
          test.expected_facts
            .split(",")
            .map((fact) => fact.trim())
            .filter(Boolean),

        expected_behavior:
          test.expected_behavior

      }));


    try {

      const response = await fetch(
        `${API_BASE}/evaluate`,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            document_id:
              documentId,

            tests:
              formattedTests

          })

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Evaluation failed."
        );

      }


      setResult(data);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="evaluation-card">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="evaluation-header">

        <div>

          <span className="section-badge">
            RAG EVALUATION
          </span>

          <h2>
            AI Quality Check
          </h2>

          <p>
            Create custom tests and measure
            retrieval and answer quality.
          </p>

        </div>


        <div className="evaluation-icon">
          🧪
        </div>

      </div>


      {/* =====================================
          CUSTOM TEST BUILDER
      ===================================== */}

      <div className="test-builder">

        <div className="test-builder-header">

          <div>

            <h3>
              Evaluation Test Suite
            </h3>

            <p>
              Add questions and expected facts
              for your selected document.
            </p>

          </div>


          <button
            className="add-test-button"
            onClick={addTest}
          >
            + Add Test
          </button>

        </div>


        {tests.map(
          (test, index) => (

            <div
              className="custom-test"
              key={index}
            >

              <div className="custom-test-top">

                <strong>
                  Test {index + 1}
                </strong>


                {tests.length > 1 && (

                  <button
                    className="remove-test-button"
                    onClick={() =>
                      removeTest(index)
                    }
                  >
                    Remove
                  </button>

                )}

              </div>


              {/* QUESTION */}

              <label>
                Question
              </label>

              <input
                type="text"
                value={test.query}
                placeholder="Example: What skills does Santosh have?"
                onChange={(event) =>
                  updateTest(
                    index,
                    "query",
                    event.target.value
                  )
                }
              />


              {/* EXPECTED FACTS */}

              <label>
                Expected Facts
              </label>

              <input
                type="text"
                value={test.expected_facts}
                placeholder="Example: Python, FastAPI, Git"
                disabled={
                  test.expected_behavior ===
                  "not_found"
                }
                onChange={(event) =>
                  updateTest(
                    index,
                    "expected_facts",
                    event.target.value
                  )
                }
              />


              <small className="field-help">
                Separate multiple facts with commas.
              </small>


              {/* BEHAVIOR */}

              <label>
                Expected Behavior
              </label>

              <select
                value={
                  test.expected_behavior
                }
                onChange={(event) =>
                  updateTest(
                    index,
                    "expected_behavior",
                    event.target.value
                  )
                }
              >

                <option value="answer">
                  Answer should be found
                </option>

                <option value="not_found">
                  Information should not be found
                </option>

              </select>

            </div>

          )
        )}

      </div>


      {/* =====================================
          RUN BUTTON
      ===================================== */}

      <button
        className="evaluate-button"
        onClick={runEvaluation}
        disabled={
          loading ||
          !documentId
        }
      >

        {loading
          ? "Running Evaluation..."
          : "Run Evaluation 🚀"}

      </button>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="evaluation-error">
          ⚠️ {error}
        </div>

      )}


      {/* =====================================
          RESULTS
      ===================================== */}

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
                {result.unsupported_query_accuracy != null
                  ? `${result.unsupported_query_accuracy}%`
                  : "—"}
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


                  {test.expected_facts?.length > 0 && (

                    <div className="test-facts">

                      <span>
                        Matched Facts
                      </span>

                      <p>
                        {test.matched_facts?.length
                          ? test.matched_facts.join(
                              ", "
                            )
                          : "No expected facts matched."}
                      </p>

                    </div>

                  )}

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
