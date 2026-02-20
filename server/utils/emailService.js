import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Srigandha Kannada Koota" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Srigandha Kannada Koota',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 5px;
            }
            .header {
              color: #d32f2f;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #d32f2f;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1 class="header">Password Reset Request</h1>
              <p>Hello ${userName || 'Admin'},</p>
              <p>We received a request to reset your password for your Srigandha Kannada Koota admin account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
              <div class="footer">
                <p>This is an automated email from Srigandha Kannada Koota. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send contact form notification to admin
export const sendContactNotification = async (contactData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured. Skipping contact notification.');
      return;
    }

    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Srigandha Kannada Koota" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Contact Message: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>From:</strong> ${contactData.name}</p>
              <p style="margin: 10px 0 0 0;"><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
              <p style="margin: 10px 0 0 0;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; line-height: 1.6; white-space: pre-line;">${contactData.message}</p>
            </div>
            <div style="margin-top: 15px; text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/contact"
                 style="display: inline-block; padding: 10px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 5px;">
                View in Admin Panel
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px; color: #666; font-size: 12px;">
            <p>Srigandha Kannada Koota CMS - Automated Notification</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent');
  } catch (error) {
    // Don't throw - notification failure shouldn't break the contact form
    console.error('Failed to send contact notification:', error.message);
  }
};

// Send password change confirmation email
export const sendPasswordChangeConfirmation = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Srigandha Kannada Koota" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully - Srigandha Kannada Koota',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 5px;
            }
            .header {
              color: #4caf50;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1 class="header">Password Changed Successfully</h1>
              <p>Hello ${userName || 'Admin'},</p>
              <p>Your password has been changed successfully.</p>
              <p>If you did not make this change, please contact the administrator immediately.</p>
              <p>Changed on: ${new Date().toLocaleString()}</p>
              <div class="footer">
                <p>This is an automated email from Srigandha Kannada Koota. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password change confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password change confirmation:', error);
    throw new Error('Failed to send confirmation email');
  }
};
