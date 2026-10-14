import { useState } from "react";
import { ArrowRight } from "lucide-react";
export default function ContactForm() {
  const [notice, setNotice] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(true);
      }}
      aria-describedby="form-note"
    >
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Name"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label>
        Your message
        <textarea
          name="message"
          required
          rows={5}
          maxLength={3000}
          placeholder="Tell us about your idea…"
        />
      </label>
      <p id="form-note">
        Interface preview only. Message delivery is not configured. Nothing is
        sent or stored.
      </p>
      <button className="button primary" type="submit">
        Preview contact request <ArrowRight size={17} />
      </button>
      {notice && (
        <p role="status" className="form-notice">
          Your message has not been sent. Contact delivery is unavailable until
          an approved backend is configured.
        </p>
      )}
    </form>
  );
}
