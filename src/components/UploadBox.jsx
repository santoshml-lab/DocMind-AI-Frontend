function UploadBox() {
  return (
    <section className="upload-card">

      <div className="upload-icon">
        📄
      </div>

      <h2>Upload Document</h2>

      <p>
        Upload a PDF document to start asking questions.
      </p>

      <label className="file-button">
        Choose PDF

        <input
          type="file"
          accept=".pdf,application/pdf"
        />
      </label>

    </section>
  );
}

export default UploadBox;
