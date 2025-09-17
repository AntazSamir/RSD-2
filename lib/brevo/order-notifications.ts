import { sendOrderConfirmation, sendEmail } from './email-service'

/**
 * Send order confirmation email
 * @param orderData - Order details
 * @returns Promise with email sending result
 */
export async function notifyOrderConfirmation(orderData: {
  id: string
  customerName: string
  customerEmail: string
  tableId: string
  status: string
  totalAmount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    specialRequests?: string
  }>
  notes?: string
  createdAt: string
}) {
  try {
    // Format order items for email
    const orderItems = orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    // Send confirmation email
    const result = await sendOrderConfirmation(
      orderData.customerEmail,
      {
        customerName: orderData.customerName,
        orderId: orderData.id,
        orderTotal: orderData.totalAmount,
        orderItems,
      }
    )

    if (result.success) {
      console.log(`Order confirmation email sent for order ${orderData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send order confirmation email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyOrderConfirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send order status update email
 * @param orderData - Order details
 * @param newStatus - New order status
 * @returns Promise with email sending result
 */
export async function notifyOrderStatusUpdate(orderData: {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}, newStatus: string) {
  try {
    // Define status messages
    const statusMessages: Record<string, string> = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is currently being prepared by our chefs.',
      ready: 'Your order is ready for pickup or delivery.',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'We regret to inform you that your order has been cancelled.',
    }

    // Send status update email
    const result = await sendEmail({
      to: orderData.customerEmail,
      subject: `Order Status Update - ${newStatus.toUpperCase()}`,
      html: `
        <h2>Order Status Update</h2>
        <p>Hello ${orderData.customerName},</p>
        <p>${statusMessages[newStatus] || `Your order status has been updated to: ${newStatus}`}</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
        
        <h3>Items:</h3>
        <ul>
          ${orderData.items.map(item => `
            <li>${item.quantity} x ${item.name} - $${(item.quantity * item.price).toFixed(2)}</li>
          `).join('')}
        </ul>
        
        <p>Thank you for choosing our restaurant!</p>
        <p>Best regards,<br/>Restaurant Team</p>
      `,
    })

    if (result.success) {
      console.log(`Order status update email sent for order ${orderData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send order status update email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyOrderStatusUpdate:', error)
    return { success: false, error }
  }
}

/**
 * Send order cancellation email
 * @param orderData - Order details
 * @returns Promise with email sending result
 */
export async function notifyOrderCancellation(orderData: {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  cancellationReason?: string
}) {
  try {
    // Send cancellation email
    const result = await sendEmail({
      to: orderData.customerEmail,
      subject: 'Order Cancellation - Restaurant Dashboard',
      html: `
        <h2>Order Cancellation</h2>
        <p>Hello ${orderData.customerName},</p>
        <p>We're writing to inform you that your order #${orderData.id} has been cancelled.</p>
        
        ${orderData.cancellationReason ? `
          <p><strong>Cancellation Reason:</strong> ${orderData.cancellationReason}</p>
        ` : ''}
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Original Total:</strong> $${orderData.totalAmount.toFixed(2)}</p>
        
        <h3>Items:</h3>
        <ul>
          ${orderData.items.map(item => `
            <li>${item.quantity} x ${item.name} - $${(item.quantity * item.price).toFixed(2)}</li>
          `).join('')}
        </ul>
        
        <p>If you have any questions or would like to place a new order, please contact us.</p>
        <p>Best regards,<br/>Restaurant Team</p>
      `,
    })

    if (result.success) {
      console.log(`Order cancellation email sent for order ${orderData.id}`)
      return { success: true, messageId: result.messageId }
    } else {
      console.error(`Failed to send order cancellation email:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('Error in notifyOrderCancellation:', error)
    return { success: false, error }
  }
}