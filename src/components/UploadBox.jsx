import { useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function UploadBox({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setStatus("Please select a PDF file only.");
      setStatusType("error");
      return;
    }

    setFile(selectedFile);
    setStatus("");
    setStatusType("");
  };

  const uploadPDF = async () => {
    if (!file) {
      setStatus("Please choose a PDF first.");
      setStatusType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Uploading and processing your document...");
      setStatusType("loading");

      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      onUploadSuccess(data.document_id);

      setStatus(
        `Document ready 🚀 ${data.filename} — ${data.stored_chunks} chunks indexed.`
      );

      setStatusType("success");

    } catch (error) {
      setStatus(`Error: ${error.message}`);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-card">

      <div className="upload-icon">
        📄
      </div>

      <h2>Upload Your Document</h2>

      <p>
        Upload a PDF and let DocMind AI build a searchable
        knowledge base from it.
      </p>

      <label className="file-button">

        {file ? "📄 " + file.name : "Choose PDF"}

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={loading}
        />

      </label>

      {file && (
        <div className="selected-file">

          <strong>Selected document</strong>

          <span>
            {file.name}
          </span>

          <small>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </small>

        </div>
      )}

      <button
        className="upload-button"
        onClick={uploadPDF}
        disabled={loading || !file}
      >
        {loading
          ? "Processing..."
          : "Upload & Process 🚀"}
      </button>

      {status && (
        <div className={`upload-status ${statusType}`}>
          {status}
        </div>
      )}

    </section>
  );
}

export default UploadBox;

  
    
      
          
