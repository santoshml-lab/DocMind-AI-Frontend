function ChatBox() {
  return (
    <section className="chat-card">

      <h2>Ask Your Document</h2>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask something about your document..."
        />

        <button>
          Ask 🤖
        </button>

      </div>

    </section>
  );
}

export default ChatBox;
