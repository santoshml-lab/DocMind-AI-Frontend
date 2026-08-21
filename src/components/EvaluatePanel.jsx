import { useState } from "react";

const API_BASE =
  "https://docmind-ai-backend-nwhv.onrender.com";

function EvaluatePanel({ documentId }) {
  const [tests, setTests] = useState([
    {
      id: Date.now(),
      query: "",
      expected_facts: "",
      expected_behavior: "answer",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // ADD TEST
  // =====================================================

  const addTest = () => {
    setTests((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        query: "",
        expected_facts: "",
        expected_behavior: "answer",
      },
    ]);
  };

  // =====================================================
  // REMOVE TEST
  // =====================================================

  const removeTest = (id) => {
    setTests((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((test) => test.id !== id);
    });
  };

  // =====================================================
  // UPDATE TEST
  // =====================================================

  const updateTest = (id, field, value) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === id
          ? {
              ...test,
              [field]: value,
            }
          : test
      )
    );
  };

  // =====================================================
  // RUN EVALUATION
  // =====================================================

  const runEvaluation = async () => {
    if (!documentId) {
      setError("Please select a document first.");
      return;
    }

    // ---------------------------------------------------
    // VALIDATE QUESTIONS
    // ---------------------------------------------------

    const validTests = tests.filter(
      (test) => test.query.trim()
    );

    if (!validTests.length) {
      setError("Please add at least one question.");
      return;
    }

    // ---------------------------------------------------
    // BUILD API TESTS
    // ---------------------------------------------------

    const apiTests = validTests.map((test) => ({
      query: test.query.trim(),

      expected_facts: test.expected_facts
        .split(",")
        .map((fact) => fact.trim())
        .filter(Boolean),

      expected_behavior:
        test.expected_behavior,
    }));

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE}/evaluate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            document_id: documentId,
            tests: apiTests,
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

      setResult(data);
    } catch (error) {
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

      {/* =================================================
          HEADER
      ================================================= */}

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
            retrieval and answer quality for
            the selected document.
          </p>
        </div>

        <div className="evaluation-icon">
          🧪
        </div>
      </div>


      {/* =================================================
          TEST SUITE
      ================================================= */}

      <div className="evaluation-suite">

        <div className="suite-header">

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
            type="button"
          >
            + Add Test
          </button>

        </div>


        {/* =================================================
            TESTS
        ================================================= */}

        {tests.map((test, index) => (

          <div
            className="evaluation-test-editor"
            key={test.id}
          >

            <div className="test-editor-header">

              <strong>
                Test {index + 1}
              </strong>

              {tests.length > 1 && (
                <button
                  className="remove-test-button"
                  onClick={() =>
                    removeTest(test.id)
                  }
                  type="button"
                >
                  Remove
                </button>
              )}

            </div>


            {/* QUESTION */}

            <div className="form-group">

              <label>
                Question
              </label>

              <input
                type="text"
                value={test.query}
                onChange={(e) =>
                  updateTest(
                    test.id,
                    "query",
                    e.target.value
                  )
                }
                placeholder="Example: What skills does this person have?"
              />

            </div>


            {/* EXPECTED FACTS */}

            <div className="form-group">

              <label>
                Expected Facts
              </label>

              <input
                type="text"
                value={test.expected_facts}
                onChange={(e) =>
                  updateTest(
                    test.id,
                    "expected_facts",
                    e.target.value
                  )
                }
                placeholder="Example: Python, FastAPI, Git"
              />

              <small>
                Separate multiple facts with commas.
              </small>

            </div>


            {/* EXPECTED BEHAVIOR */}

            <div className="form-group">

              <label>
                Expected Behavior
              </label>

              <select
                value={
                  test.expected_behavior
                }
                onChange={(e) =>
                  updateTest(
                    test.id,
                    "expected_behavior",
                    e.target.value
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

          </div>

        ))}

      </div>


      {/* =================================================
          RUN BUTTON
      ================================================= */}

      <button
        className="evaluate-button"
        onClick={runEvaluation}
        disabled={
          loading ||
          !documentId
        }
        type="button"
      >

        {loading
          ? "Running Evaluation..."
          : "Run Evaluation 🚀"}

      </button>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="evaluation-error">
          ⚠️ {error}
        </div>

      )}


      {/* =================================================
          RESULTS
      ================================================= */}

      {result && (

        <>

          {/* =================================================
              METRICS
          ================================================= */}

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
                {result.unsupported_query_accuracy ??
                  "—"}%
              </strong>

              <small>
                Unsupported query accuracy
              </small>

            </div>

          </div>


          {/* =================================================
              TEST SUMMARY
          ================================================= */}

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


          {/* =================================================
              TEST RESULTS
          ================================================= */}

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
                          test.top_similarity *
                            100
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
                        Expected Facts
                      </span>

                      <p>
                        {test.expected_facts.join(
                          ", "
                        )}
                      </p>

                    </div>

                  )}


                  {test.matched_facts?.length > 0 && (

                    <div className="test-facts matched">

                      <span>
                        Matched Facts
                      </span>

                      <p>
                        {test.matched_facts.join(
                          ", "
                        )}
                      </p>

                    </div>

                  )}


                  {test.fact_coverage != null && (

                    <div className="test-fact-coverage">

                      Fact Coverage

                      <strong>
                        {" "}
                        {test.fact_coverage}%
                      </strong>

                    </div>

                  )}


                  {test.error && (

                    <div className="evaluation-error">

                      ⚠️ {test.error}

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
