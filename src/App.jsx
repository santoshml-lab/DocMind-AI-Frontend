import { useState } from "react";
import UploadBox from "./UploadBox";
import ChatBox from "./ChatBox";

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
