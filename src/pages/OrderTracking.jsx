import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";

import OrderItem from "../components/checkout/OrderItem";
import OrderStatus from "../components/checkout/OrderStatus";

function OrderTracking() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(orderId);
        setOrder(response.data?.order);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load this order. Please check the order ID."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">Loading order...</div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="checkout-page">
        <div className="checkout-message checkout-error">
          {error || "Order not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container checkout-result-container">
        <header className="checkout-header">
          <span className="checkout-eyebrow">ORDER INFORMATION</span>
          <h1>Track Your Order</h1>
          <p>Follow the current status of your purchase.</p>
        </header>

        <section className="checkout-card checkout-tracking-card">
          <div>
            <span className="checkout-muted-label">Order ID</span>
            <strong>{order._id}</strong>
          </div>

          <div>
            <span className="checkout-muted-label">Order Date</span>
            <strong>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Not available"}
            </strong>
          </div>

          <div>
            <span className="checkout-muted-label">Current Status</span>
            <OrderStatus status={order.status} />
          </div>
        </section>

        <section className="checkout-card">
          <h2 className="checkout-section-title">Order Items</h2>

          <div className="checkout-items-list">
            {order.items?.map((item, index) => (
              <OrderItem
                key={item._id || item.product || index}
                item={item}
              />
            ))}
          </div>
        </section>

        <section className="checkout-card">
          <h2 className="checkout-section-title">Shipping Information</h2>

          <div className="checkout-address">
            <strong>{order.shippingAddress?.fullName}</strong>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.country}
            </p>
            <p>{order.shippingAddress?.postalCode}</p>
          </div>
        </section>

        <section className="checkout-card">
          <h2 className="checkout-section-title">Payment & Total</h2>

          <div className="checkout-price-details">
            <div>
              <span>Subtotal</span>
              <strong>{Number(order.subtotal || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>Discount</span>
              <strong className="checkout-discount">
                -{Number(order.discount || 0).toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Shipping Fee</span>
              <strong>{Number(order.shippingFee || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>Tax</span>
              <strong>{Number(order.tax || 0).toFixed(2)}</strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{Number(order.totalPrice || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div className="checkout-payment-info">
            <span>Payment Method</span>
            <strong>
              {order.paymentMethod === "cash"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </strong>
          </div>

          <div className="checkout-payment-info">
            <span>Payment Status</span>
            <strong>{order.paymentStatus || "Not available"}</strong>
          </div>
        </section>

        <Link to="/checkout" className="checkout-back-link">
          Back to Checkout
        </Link>
      </div>
    </main>
  );
}

export default OrderTracking;