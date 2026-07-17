export function ContactForm({ status }: { status?: string }) {
  return (
    <div className="contact-form-wrap">
      {status === "success" && <p className="form-alert success" role="status">Thanks—your message has been sent.</p>}
      {status === "error" && <p className="form-alert error" role="alert">That message could not be sent. Please try again or email directly.</p>}
      <form className="contact-form" action="/api/contact" method="post">
        <div className="form-row">
          <label><span>Name</span><input name="name" type="text" autoComplete="name" required maxLength={100} /></label>
          <label><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
        </div>
        <label><span>Subject</span><select name="subject" defaultValue="General inquiry"><option>General inquiry</option><option>Music collaboration</option><option>Booking or performance</option><option>Press or media</option><option>Writing or photography</option></select></label>
        <label><span>Message</span><textarea name="message" rows={7} required maxLength={5000} /></label>
        <label className="form-honeypot" aria-hidden="true">Company website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
        <button className="button button-primary" type="submit">Send message <span aria-hidden="true">→</span></button>
        <p className="form-note">Messages are delivered securely to Taylon&apos;s official inbox.</p>
      </form>
    </div>
  );
}
