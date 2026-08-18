import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";

function Home() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-container">

        <section className="hero">
          <span className="hero-badge">
            RAG • AI • DOCUMENT INTELLIGENCE
          </span>

          <h1>DocMind AI</h1>

          <p>
            Upload your document and ask intelligent questions
            using AI-powered document retrieval.
          </p>
        </section>

        <UploadBox />

        <ChatBox />

      </main>
    </div>
  );
}

export default Home;
