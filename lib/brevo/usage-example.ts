/**
 * Example usage of Brevo email notifications in the restaurant dashboard
 * This file demonstrates how to integrate email notifications into various parts of the application
 */

import { notifyReservationConfirmation, notifyReservationCancellation, notifyReservationModification } from './reservation-notifications'
import { notifyOrderConfirmation, notifyOrderStatusUpdate, notifyOrderCancellation } from './order-notifications'

// Example: Send reservation confirmation after creating a reservation
export async function handleReservationCreated(reservation: any) {
  // Save reservation to database first
  // ... database operations ...
  
  // Send confirmation email
  await notifyReservationConfirmation({
    id: reservation.id,
    customerName: reservation.customerName,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    tableId: reservation.tableId,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    partySize: reservation.partySize,
    specialRequests: reservation.specialRequests,
    status: reservation.status,
  })
}

// Example: Send order confirmation after creating an order
export async function handleOrderCreated(order: any) {
  // Save order to database first
  // ... database operations ...
  
  // Send confirmation email
  await notifyOrderConfirmation({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    tableId: order.tableId,
    status: order.status,
    totalAmount: order.totalAmount,
    items: order.items,
    notes: order.notes,
    createdAt: order.createdAt,
  })
}

// Example: Send order status update when order status changes
export async function handleOrderStatusChanged(order: any, newStatus: string) {
  // Update order status in database
  // ... database operations ...
  
  // Send status update email
  await notifyOrderStatusUpdate(
    {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      items: order.items,
    },
    newStatus
  )
}

// Example: Integration with Supabase database triggers
// This would typically be in an API route or serverless function
export async function handleSupabaseReservationInsert(payload: any) {
  const reservation = payload.new
  
  // Send confirmation email
  await notifyReservationConfirmation({
    id: reservation.id,
    customerName: reservation.customer_name,
    customerEmail: reservation.customer_email,
    customerPhone: reservation.customer_phone,
    tableId: reservation.table_id,
    reservationDate: reservation.reservation_date,
    reservationTime: reservation.reservation_time,
    partySize: reservation.party_size,
    specialRequests: reservation.special_requests,
    status: reservation.status,
  })
}

// Example: Integration with order management system
export async function updateOrderStatus(orderId: string, newStatus: string) {
  // Fetch order from database
  // const order = await supabase.from('orders').select('*').eq('id', orderId).single()
  
  // For this example, we'll use mock data
  const order = {
    id: orderId,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    totalAmount: 25.99,
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { id: '3', name: 'Mineral Water', quantity: 2, price: 4.01 }
    ]
  }
  
  // Update status in database
  // ... database operations ...
  
  // Send status update email
  await notifyOrderStatusUpdate(order, newStatus)
}