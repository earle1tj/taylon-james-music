import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const allowedSubjects = new Set(["General inquiry", "Music collaboration", "Booking or performance", "Press or media", "Writing or photography"]);

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  const form = await request.formData();
  if (clean(form.get("website"), 200)) return NextResponse.redirect(new URL("/contact?status=success", request.url), 303);

  const name = clean(form.get("name"), 100);
  const email = clean(form.get("email"), 160);
  const selectedSubject = clean(form.get("subject"), 80);
  const subject = allowedSubjects.has(selectedSubject) ? selectedSubject : "General inquiry";
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !validEmail || !message) return NextResponse.redirect(new URL("/contact?status=error", request.url), 303);

  try {
    const user = process.env.SMTP_USER ?? "info@taylonearle.com";
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "mail.privateemail.com",
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_PORT ?? "465") === "465",
      auth: { user, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `Taylon James Website <${user}>`,
      to: process.env.CONTACT_TO ?? "info@taylonearle.com",
      replyTo: email,
      subject: `[Taylon James Website] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n`,
    });
    return NextResponse.redirect(new URL("/contact?status=success", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/contact?status=error", request.url), 303);
  }
}
