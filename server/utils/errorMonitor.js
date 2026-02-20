import nodemailer from 'nodemailer';

// Email configuration for alerts
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_EMAIL_PASSWORD
    }
  });
};

// Send error alert email
export const sendErrorAlert = async (error, context = {}) => {
  try {
    // Only send alerts in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Check if email is configured
    if (!process.env.ALERT_EMAIL || !process.env.ALERT_EMAIL_PASSWORD || !process.env.ALERT_RECIPIENT) {
      console.error('Email alert not configured. Skipping alert.');
      return;
    }

    const transporter = createTransporter();

    const errorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...context
    };

    const mailOptions = {
      from: process.env.ALERT_EMAIL,
      to: process.env.ALERT_RECIPIENT,
      subject: `🚨 Srigandha API Error Alert - ${error.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🚨 Server Error Alert</h1>
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Error Details</h2>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Timestamp:</strong> ${errorDetails.timestamp}</p>
              <p style="margin: 10px 0 0 0;"><strong>Environment:</strong> ${errorDetails.environment}</p>
            </div>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Error Message:</strong></p>
              <pre style="background-color: #fee2e2; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0 0 0;">${error.message}</pre>
            </div>

            ${context.endpoint ? `
              <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <p style="margin: 0;"><strong>Endpoint:</strong> ${context.method || 'N/A'} ${context.endpoint}</p>
                ${context.userId ? `<p style="margin: 10px 0 0 0;"><strong>User ID:</strong> ${context.userId}</p>` : ''}
              </div>
            ` : ''}

            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0;"><strong>Stack Trace:</strong></p>
              <pre style="background-color: #fef3c7; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 10px 0 0 0;">${error.stack}</pre>
            </div>

            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;"><strong>ℹ️ Action Required:</strong></p>
              <p style="margin: 10px 0 0 0; color: #1e40af;">Please check the server logs and investigate this error.</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated alert from Srigandha Kannada Koota CMS</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Error alert email sent successfully');
  } catch (emailError) {
    console.error('Failed to send error alert email:', emailError);
  }
};

// Send critical system alert
export const sendCriticalAlert = async (title, message, details = {}) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!process.env.ALERT_EMAIL || !process.env.ALERT_EMAIL_PASSWORD || !process.env.ALERT_RECIPIENT) {
      console.error('Email alert not configured. Skipping alert.');
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.ALERT_EMAIL,
      to: process.env.ALERT_RECIPIENT,
      subject: `⚠️ CRITICAL: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #991b1b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">⚠️ CRITICAL ALERT</h1>
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">${title}</h2>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0; line-height: 1.6;">${message}</p>
            </div>

            ${Object.keys(details).length > 0 ? `
              <div style="background-color: white; padding: 15px; border-radius: 6px;">
                <p style="margin: 0;"><strong>Additional Details:</strong></p>
                <pre style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0 0 0;">${JSON.stringify(details, null, 2)}</pre>
              </div>
            ` : ''}

            <div style="margin-top: 20px; padding: 15px; background-color: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px;">
              <p style="margin: 0; color: #991b1b;"><strong>⚠️ IMMEDIATE ACTION REQUIRED</strong></p>
              <p style="margin: 10px 0 0 0; color: #991b1b;">This is a critical system alert requiring immediate attention.</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated critical alert from Srigandha Kannada Koota CMS</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Critical alert email sent successfully');
  } catch (emailError) {
    console.error('Failed to send critical alert email:', emailError);
  }
};

// Send server restart notification
export const sendServerRestartAlert = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!process.env.ALERT_EMAIL || !process.env.ALERT_EMAIL_PASSWORD || !process.env.ALERT_RECIPIENT) {
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.ALERT_EMAIL,
      to: process.env.ALERT_RECIPIENT,
      subject: '🔄 Server Restarted - Srigandha API',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f59e0b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🔄 Server Restart Notification</h1>
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p style="margin: 10px 0 0 0;"><strong>Status:</strong> Server has been automatically restarted</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;"><strong>ℹ️ Information:</strong></p>
              <p style="margin: 10px 0 0 0; color: #1e40af;">The server has been automatically restarted by PM2. The service should be back online.</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated notification from Srigandha Kannada Koota CMS</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error('Failed to send restart alert email:', emailError);
  }
};
