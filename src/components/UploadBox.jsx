import { useState } from "react";

const API_BASE = "https://docmind-ai-backend-nwhv.onrender.com";

function UploadBox({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    if (!file) {
      setStatus("Please choose a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Uploading and processing...");

      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      // Save document_id in parent component
      onUploadSuccess(data.document_id);

      setStatus(
        `Success 🚀 ${data.filename} — ${data.stored_chunks} chunks stored.`
      );
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-card">
      <div className="upload-icon">📄</div>

      <h2>Upload Document</h2>

      <p>
        Upload a PDF document to start asking questions.
      </p>

      <label className="file-button">
        {file ? file.name : "Choose PDF"}

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <br />
      <br />

      <button
        className="upload-button"
        onClick={uploadPDF}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Process 🚀"}
      </button>

      {status && (
        <p className="upload-status">
          {status}
        </p>
      )}
    </section>
  );
}

export default UploadBox;

  
    
      
          
