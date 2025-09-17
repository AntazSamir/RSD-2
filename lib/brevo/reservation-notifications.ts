import { sendReservationConfirmation } from './email-service'

/**
 * Send reservation confirmation email
 * @param reservationData - Reservation details
 * @returns Promise with email sending result
 */
export async function notifyReservationConfirmation(reservationData: {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  tableId: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests?: string
  status: string
}) {
  try {
    // Format the date for display
    const formattedDate = new Date(reservationData.reservationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send confirmation email
    const result = await sendReservationConfirmation(
      reservationData.customerEmail,
      {
        customerName: reservationData.customerName,
        reservationDate: formattedDate,
        reservationTime: reservationData.reservationTime,
        partySize: reservationData.partySize,
        specialRequests: reservationData.specialRequests,
      }
    )

    if (result.success) {
      console.log(`Reservation confirmation email sent for reservation ${reservationData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send reservation confirmation email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyReservationConfirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send reservation cancellation email
 * @param reservationData - Reservation details
 * @returns Promise with email sending result
 */
export async function notifyReservationCancellation(reservationData: {
  id: string
  customerName: string
  customerEmail: string
  reservationDate: string
  reservationTime: string
  partySize: number
}) {
  try {
    // Format the date for display
    const formattedDate = new Date(reservationData.reservationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send cancellation email
    const result = await sendEmail({
      to: reservationData.customerEmail,
      subject: 'Reservation Cancellation - Restaurant Dashboard',
      html: `
        <h2>Reservation Cancellation</h2>
        <p>Hello ${reservationData.customerName},</p>
        <p>We're writing to confirm that your reservation has been cancelled with the following details:</p>
        <ul>
          <li>Date: ${formattedDate}</li>
          <li>Time: ${reservationData.reservationTime}</li>
          <li>Party Size: ${reservationData.partySize} people</li>
        </ul>
        <p>If you have any questions or would like to make a new reservation, please contact us.</p>
        <p>Best regards,<br/>Restaurant Team</p>
      `,
    })

    if (result.success) {
      console.log(`Reservation cancellation email sent for reservation ${reservationData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send reservation cancellation email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyReservationCancellation:', error)
    return { success: false, error }
  }
}

/**
 * Send reservation modification email
 * @param reservationData - Reservation details
 * @returns Promise with email sending result
 */
export async function notifyReservationModification(reservationData: {
  id: string
  customerName: string
  customerEmail: string
  oldReservationDate: string
  oldReservationTime: string
  newReservationDate: string
  newReservationTime: string
  partySize: number
}) {
  try {
    // Format the dates for display
    const oldFormattedDate = new Date(reservationData.oldReservationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    const newFormattedDate = new Date(reservationData.newReservationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send modification email
    const result = await sendEmail({
      to: reservationData.customerEmail,
      subject: 'Reservation Modification - Restaurant Dashboard',
      html: `
        <h2>Reservation Modification</h2>
        <p>Hello ${reservationData.customerName},</p>
        <p>Your reservation has been modified. Here are the updated details:</p>
        <ul>
          <li><strong>Previous Date & Time:</strong> ${oldFormattedDate} at ${reservationData.oldReservationTime}</li>
          <li><strong>New Date & Time:</strong> ${newFormattedDate} at ${reservationData.newReservationTime}</li>
          <li>Party Size: ${reservationData.partySize} people</li>
        </ul>
        <p>If you have any concerns about this change, please contact us.</p>
        <p>Best regards,<br/>Restaurant Team</p>
      `,
    })

    if (result.success) {
      console.log(`Reservation modification email sent for reservation ${reservationData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send reservation modification email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyReservationModification:', error)
    return { success: false, error }
  }
}

// Helper function to send email (imported from email-service)
import { sendEmail } from './email-service'