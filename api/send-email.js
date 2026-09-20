import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: RESEND_API_KEY is missing. Please add it to your Vercel Environment Variables.'
      });
    }

    // Parse body if needed (Vercel Node runtime usually parses JSON bodies automatically)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload.' });
      }
    }

    const { name, email, subject, message } = body || {};

    // Validate fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide your name.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'The email address format is invalid.' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Please include a message description.' });
    }

    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().slice(0, 120);
    const sanitizedSubject = (subject && typeof subject === 'string' ? subject.trim().slice(0, 150) : '') || 'New Portfolio Inquiry';
    const sanitizedMessage = message.trim().slice(0, 5000);

    const resend = new Resend(apiKey);
    const recipientEmail = process.env.CONTACT_EMAIL || 'krismak1110@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      replyTo: sanitizedEmail,
      subject: `[Portfolio Contact] ${sanitizedSubject} - from ${sanitizedName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #991b1b; margin: 0; font-size: 22px; letter-spacing: 0.5px;">📜 New Portfolio Message</h2>
            <span style="font-size: 13px; color: #64748b;">Received from your 3D Portfolio Website</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 100px; font-weight: 600;">Sender:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${sanitizedName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${sanitizedEmail}" style="color: #2563eb; text-decoration: none;">${sanitizedEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject:</td>
              <td style="padding: 8px 0; color: #0f172a;">${sanitizedSubject}</td>
            </tr>
          </table>

          <div style="padding: 18px 20px; background-color: #f8fafc; border-left: 4px solid #b91c1c; border-radius: 6px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Message:</h4>
            <p style="margin: 0; white-space: pre-wrap; font-size: 15px; color: #1e293b; line-height: 1.6;">${sanitizedMessage}</p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
            Dispatched via Vercel Serverless Function & Resend API
          </div>
        </div>
      `,
      text: `New Portfolio Message from ${sanitizedName} (${sanitizedEmail})\n\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitizedMessage}`
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to send email via Resend.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email dispatched successfully.',
      id: data?.id
    });
  } catch (err) {
    console.error('Unexpected error in send-email handler:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected server error occurred.'
    });
  }
}
