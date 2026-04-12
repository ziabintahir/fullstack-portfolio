/**
 * Contact Controller
 * Stores messages in DB + sends email via Nodemailer.
 */

const nodemailer = require("nodemailer");
const { query } = require("../config/db");
const logger = require("../utils/logger");

// ──────────────────────────────────────────────
// Nodemailer transporter (lazy init)
// ──────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password, NOT account password
    },
  });

/**
 * POST /contact — submit a contact message
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";

    // Persist to DB
    await query(
      "INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)",
      [name, email, subject || null, message, ip]
    );

    // Send email notification (non-blocking — don't fail request if email fails)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();

        // Notification to portfolio owner
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `📬 New Contact: ${subject || "Portfolio Message"} — from ${name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
              <h2 style="color:#3b82f6">New Portfolio Message</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold;width:100px">Name:</td><td>${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px;font-weight:bold">Subject:</td><td>${subject || "—"}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message:</td><td>${message.replace(/\n/g, "<br>")}</td></tr>
              </table>
            </div>
          `,
        });

        // Auto-reply to sender
        await transporter.sendMail({
          from: `"Zia Bin Tahir" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Thanks for reaching out! ✉️",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
              <h2 style="color:#3b82f6">Hi ${name},</h2>
              <p>Thank you for your message! I've received it and will get back to you within 24–48 hours.</p>
              <p style="color:#6b7280;font-size:0.875rem">This is an automated reply — please don't reply to this email.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
              <p><strong>Zia Bin Tahir</strong><br>Backend Developer | DevOps Engineer</p>
            </div>
          `,
        });

        logger.info(`Contact email sent for message from: ${email}`);
      } catch (emailErr) {
        logger.error(`Email send failed (message still saved): ${emailErr.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// ADMIN endpoints
// ──────────────────────────────────────────────

const getAllMessages = async (req, res, next) => {
  try {
    const { is_read } = req.query;
    let sql = "SELECT * FROM contact_messages WHERE 1=1";
    const params = [];

    if (is_read !== undefined) {
      sql += " AND is_read = ?";
      params.push(is_read === "true" ? 1 : 0);
    }

    sql += " ORDER BY created_at DESC";
    const messages = await query(sql, params);

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await query("UPDATE contact_messages SET is_read = TRUE WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Message marked as read." });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    await query("DELETE FROM contact_messages WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getAllMessages, markAsRead, deleteMessage };
