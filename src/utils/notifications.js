/**
 * Notification Service
 * Handles SMS and Email notifications for parcel status updates
 * 
 * In production, integrate with:
 * - Twilio for SMS notifications
 * - SendGrid or Mailgun for email notifications
 * - Firebase Cloud Messaging for push notifications
 */

export async function sendNotification(parcel, notificationType = 'status_update') {
  const message = generateNotificationMessage(parcel, notificationType)
  
  try {
    // Log notification (in production, send to actual service)
    console.log('[Notification Sent]', {
      type: notificationType,
      recipient: parcel.receiver_phone,
      email: parcel.receiver_email || 'N/A',
      message: message.text,
      timestamp: new Date().toISOString(),
    })

    // Show local notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('CommonSwift Logistics', {
        body: message.text,
        icon: '🕊️',
        tag: `parcel-${parcel.tracking_number}`,
      })
    }

    return { success: true, message: 'Notification sent successfully' }
  } catch (error) {
    console.error('Notification error:', error)
    return { success: false, error: error.message }
  }
}

export function generateNotificationMessage(parcel, type) {
  const messages = {
    status_update: {
      text: `Your parcel ${parcel.tracking_number} is now ${parcel.status}. Tracking: ${parcel.destination}`,
      subject: `Delivery Update: ${parcel.tracking_number}`,
    },
    parcel_received: {
      text: `Your parcel ${parcel.tracking_number} has been received at ${new Date(parcel.received_at).toLocaleDateString()}`,
      subject: `Parcel Received: ${parcel.tracking_number}`,
    },
    out_for_delivery: {
      text: `Your parcel ${parcel.tracking_number} is out for delivery today. Expected at ${parcel.destination}`,
      subject: `Out for Delivery: ${parcel.tracking_number}`,
    },
    delivered: {
      text: `Your parcel ${parcel.tracking_number} has been delivered to ${parcel.destination}`,
      subject: `Delivered: ${parcel.tracking_number}`,
    },
  }

  return messages[type] || messages.status_update
}

export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

/**
 * Integration placeholders for production services
 */

export async function sendSMS(phoneNumber, message) {
  // TODO: Integrate with Twilio
  // const client = twilio(ACCOUNT_SID, AUTH_TOKEN)
  // await client.messages.create({
  //   body: message,
  //   from: TWILIO_PHONE,
  //   to: phoneNumber,
  // })
  console.log(`[SMS] To ${phoneNumber}: ${message}`)
}

export async function sendEmail(email, subject, htmlContent) {
  // TODO: Integrate with SendGrid or Mailgun
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@commonswiftlogistics.com',
  //   subject,
  //   html: htmlContent,
  // })
  console.log(`[EMAIL] To ${email}: ${subject}`)
}
