function Contact() {
  function sendMessage(event) {
    event.preventDefault();

    alert("Your message has been sent!");
  }

  return (
    <main className="contact-page">
      <h1>Contact Us</h1>

      <p>
        Have a question? Send us a message.
      </p>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Your Name"
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          required
        />

        <textarea
          rows="5"
          placeholder="Write your message..."
          required
        />

        <button type="submit">
          Send Message
        </button>
      </form>
    </main>
  );
}

export default Contact;