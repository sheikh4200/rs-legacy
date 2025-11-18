// app/components/OrderDetails.tsx - Updated version
"use client";

import { useState, useEffect } from 'react';
import { useOrder } from '../../lib/order-context';
import './OrderDetails.css';
import Link from 'next/link';

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const { getOrder } = useOrder();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time status updates
  useEffect(() => {
    if (!orderId) return;

    const loadOrder = () => {
      try {
        setLoading(true);
        
        // First try to get from order context (real order)
        const realOrder = getOrder(orderId);
        
        if (realOrder) {
          setOrder(realOrder);
          setLoading(false);
          return;
        }

        // If no real order found, use mock data (for demo purposes)
        // In production, you would make an API call here
        const mockOrder = {
          id: orderId,
          orderNumber: orderId.startsWith('ORD-') ? orderId : `RS-${orderId}`,
          date: new Date().toISOString(),
          status: 'pending',
          total: 149.97,
          subtotal: 129.97,
          shipping: 15.00,
          tax: 5.00,
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '+1 (555) 123-4567',
            email: 'john.doe@example.com'
          },
          billingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          paymentMethod: {
            type: 'jazzcash',
            brand: 'jazzcash'
          },
          items: [
            {
              id: '1',
              name: 'Vintage Racing Jacket',
              price: 89.99,
              quantity: 1,
              image: '/images/jacket.jpg',
              size: 'M',
              color: 'Red'
            },
            {
              id: '2',
              name: 'Performance Racing Gloves',
              price: 39.98,
              quantity: 2,
              image: '/images/gloves.jpg',
              size: 'L',
              color: 'Black'
            }
          ],
          tracking: {
            carrier: 'UPS',
            trackingNumber: `1Z${Date.now().toString().slice(-16)}`,
            status: 'pending',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            history: [
              {
                date: new Date().toISOString(),
                status: 'Order Placed',
                location: 'Warehouse',
                description: 'Order received and being processed'
              }
            ]
          }
        };
        
        setOrder(mockOrder);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    loadOrder();

    // Simulate real-time status updates
    const statusUpdates = [
      { status: 'confirmed', after: 10000, message: 'Order confirmed' },
      { status: 'processing', after: 30000, message: 'Processing order' },
      { status: 'shipped', after: 60000, message: 'Order shipped' },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    statusUpdates.forEach((update, index) => {
      const timeout = setTimeout(() => {
        setOrder((prevOrder: any) => {
          if (!prevOrder) return prevOrder;
          
          const newHistory = {
            date: new Date().toISOString(),
            status: update.message,
            location: 'Processing Center',
            description: `Order ${update.message.toLowerCase()}`
          };

          return {
            ...prevOrder,
            status: update.status,
            tracking: prevOrder.tracking ? {
              ...prevOrder.tracking,
              status: update.status,
              history: [newHistory, ...prevOrder.tracking.history]
            } : undefined
          };
        });
      }, update.after);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [orderId, getOrder]);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: '#f39c12',
      confirmed: '#3498db',
      processing: '#9b59b6',
      shipped: '#27ae60',
      delivered: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return statusColors[status] || '#95a5a6';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-error">
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="order-details">
      <div className="order-header">
        <h1>Order Details</h1>
        <div className="order-meta">
          <div className="order-number">Order #: {order.orderNumber}</div>
          <div className="order-date">Placed on: {formatDate(order.date)}</div>
        </div>
      </div>

      {/* Order Status */}
      <div className="order-status-section">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
        <p className="status-description">
          {order.status === 'pending' && 'Your order has been received and is being processed.'}
          {order.status === 'confirmed' && 'Your order has been confirmed and is being prepared.'}
          {order.status === 'processing' && 'Your order is being processed and will ship soon.'}
          {order.status === 'shipped' && 'Your order has been shipped and is on its way.'}
          {order.status === 'delivered' && 'Your order has been delivered.'}
          {order.status === 'cancelled' && 'Your order has been cancelled.'}
        </p>
      </div>

      {/* Order Items */}
      <div className="order-section">
        <h2>Order Items</h2>
        <div className="order-items">
          {order.items.map((item: any) => (
            <div key={item.id} className="order-item">
              <div className="item-image-container">
                <img src={item.image} alt={item.name} className="item-image" />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-attributes">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <div className="item-quantity">Quantity: {item.quantity}</div>
              </div>
              <div className="item-price">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="order-section">
        <h2>Shipping Information</h2>
        <div className="address-card">
          <strong>{order.shippingAddress.name}</strong>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          {order.shippingAddress.phone && (
            <p className="contact-info">Phone: {order.shippingAddress.phone}</p>
          )}
          {order.shippingAddress.email && (
            <p className="contact-info">Email: {order.shippingAddress.email}</p>
          )}
        </div>
      </div>

      {/* Tracking Information */}
      {order.tracking && (
        <div className="order-section">
          <h2>Tracking Information</h2>
          <div className="tracking-info">
            <div className="tracking-meta">
              <span><strong>Carrier:</strong> {order.tracking.carrier}</span>
              <span><strong>Tracking #:</strong> {order.tracking.trackingNumber}</span>
              <span><strong>Status:</strong> {order.tracking.status}</span>
              <span><strong>Estimated Delivery:</strong> {formatDate(order.tracking.estimatedDelivery)}</span>
            </div>
            <div className="tracking-timeline">
              <h4>Tracking History</h4>
              {order.tracking.history.map((event: any, index: number) => (
                <div key={index} className="timeline-event">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="event-status">{event.status}</div>
                    <div className="event-date">{formatDate(event.date)}</div>
                    <div className="event-location">{event.location}</div>
                    <div className="event-description">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="order-section">
        <h2>Payment Information</h2>
        <div className="payment-info">
          <div className="payment-method">
            <strong>Payment Method:</strong>
            <span className="payment-details">
              {order.paymentMethod.type === 'jazzcash' && 'JazzCash'}
              {order.paymentMethod.type === 'easypaisa' && 'EasyPaisa'}
              {order.paymentMethod.type === 'card' && `Credit Card ending in ${order.paymentMethod.lastFour}`}
              {!['jazzcash', 'easypaisa', 'card'].includes(order.paymentMethod.type) && 
                order.paymentMethod.type.charAt(0).toUpperCase() + order.paymentMethod.type.slice(1)
              }
            </span>
          </div>
          <div className="payment-status">
            <strong>Payment Status:</strong>
            <span className="status-paid">Paid</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-section">
        <h2>Order Summary</h2>
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal ({order.items.length} items):</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button className="btn-secondary" onClick={() => window.print()}>
          Print Order
        </button>
        <button className="btn-secondary" onClick={() => window.history.back()}>
         <Link href={"/checkout/payment"}> Back to Orders</Link>
        </button>
        {order.status === 'delivered' && (
          <button className="btn-primary">
            Request Return
          </button>
        )}
        {order.status === 'pending' && (
          <button className="btn-cancel">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;