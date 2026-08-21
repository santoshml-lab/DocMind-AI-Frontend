🚀 DocMind AI — Frontend

«AI-powered document knowledge assistant built with React + Vite.»

DocMind AI is a modern frontend for a Retrieval-Augmented Generation (RAG) document assistant. It allows users to upload documents, select a document, ask questions, view retrieved sources, and evaluate the quality of AI-generated answers.

The frontend communicates with a FastAPI backend that handles document processing, embeddings, vector search, and AI generation.

---

✨ Features

- 📄 PDF Document Upload
- 🤖 AI Document Chat
- 🔎 RAG-powered Question Answering
- 📚 Source & Chunk Retrieval
- 📊 Document Analytics
- 🧪 RAG Evaluation System
- ✅ Answer Quality Testing
- 🎯 Fact Coverage Measurement
- 📈 Retrieval Similarity Score
- 🗂️ Document Management
- ⚡ Real-time Loading & Error States
- 📱 Responsive Modern UI

---

🧠 RAG Workflow

User uploads PDF
       ↓
Frontend sends document to API
       ↓
FastAPI processes the document
       ↓
PDF text → Chunks → Embeddings
       ↓
Supabase + pgvector
       ↓
User asks a question
       ↓
Query Embedding
       ↓
Vector Similarity Search
       ↓
Relevant Document Chunks
       ↓
Groq LLM
       ↓
AI Answer + Sources
       ↓
Frontend displays the result

---

🏗️ Architecture

┌─────────────────────────────┐
│        React + Vite         │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│           Backend            │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌────────────┐   ┌─────────────┐
│ Supabase   │   │  Groq LLM   │
│ + pgvector │   │             │
└────────────┘   └─────────────┘
       ▲
       │
┌────────────┐
│ HuggingFace│
│ Embeddings │
└────────────┘

---

🛠️ Tech Stack

Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

Backend

- FastAPI
- Python
- pdfplumber

AI / RAG

- Hugging Face Embeddings
- "intfloat/multilingual-e5-large"
- Groq LLM
- Retrieval-Augmented Generation

Database

- Supabase
- PostgreSQL
- pgvector

Deployment

- Vercel — Frontend
- Render — Backend

---

📂 Project Structure

DocMind-AI-Frontend/
│
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx
│   │   ├── EvaluatePanel.jsx
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md

---

⚙️ Local Setup

1. Clone the repository

git clone https://github.com/santoshml-lab/DocMind-AI-Frontend.git

2. Enter the project

cd DocMind-AI-Frontend

3. Install dependencies

npm install

4. Start the development server

npm run dev

The application will be available on the local Vite development server.

---

🔗 Backend API

The frontend communicates with the deployed DocMind AI FastAPI backend.

https://docmind-ai-backend-nwhv.onrender.com

The backend provides APIs for:

- Document upload
- Document listing
- Document deletion
- Vector search
- RAG question answering
- Document analytics
- RAG evaluation

---

🧪 RAG Evaluation

DocMind AI includes a custom evaluation interface for measuring RAG quality.

Users can create tests containing:

Question
Expected Facts
Expected Behavior

The system measures:

- Overall Accuracy
- Retrieval Success Rate
- Fact Coverage
- Unsupported Query Accuracy
- Retrieval Similarity

Example:

Question:
What skills are listed in the document?

Expected Facts:
Java, OOP, Collections, SQL, Spring,
Spring Boot, REST, Docker, Kafka

This makes it possible to evaluate the RAG pipeline instead of relying only on whether the chatbot "looks like it works."

---

🎯 Why DocMind AI?

Traditional document search often requires users to manually find information.

DocMind AI provides a conversational interface where users can ask questions in natural language and receive answers grounded in the selected document.

The project demonstrates practical implementation of:

- Retrieval-Augmented Generation
- Semantic Search
- Vector Databases
- Embeddings
- LLM Integration
- API Development
- AI Evaluation
- Full-stack AI deployment

---

🌐 Live Demo

Live Application:

https://doc-mind-ai-frontend.vercel.app/

---

🔗 Related Repository

Backend Repository:

https://github.com/santoshml-lab/DocMind-AI-Backend

---

📌 Project Status

Status: ✅ Completed

DocMind AI includes a complete document-to-answer RAG pipeline with document management, source retrieval, analytics, and evaluation capabilities.

---

👨‍💻 Author

Santosh

Built as a practical AI/RAG engineering project to explore document intelligence, semantic retrieval, vector databases, and LLM-powered applications.

---

⭐ Support

If you find this project interesting, consider giving the repository a ⭐.

DocMind AI — Ask your documents. Get grounded answers. 🤖📄
