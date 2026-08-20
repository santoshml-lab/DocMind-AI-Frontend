import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";

function App() {
  const [documentId, setDocumentId] = useState("");

  return (
    <>
      <UploadBox onUploadSuccess={setDocumentId} />
      <ChatBox documentId={documentId} />
    </>
  );
}

export default App;
