import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";

import OrderItem from "../components/checkout/OrderItem";
import OrderStatus from "../components/checkout/OrderStatus";

function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await getOrderById(orderId);
        setOrder(response.data?.order);
      } catch (err) {
        if (!location.state?.order) {
          setError("Unable to load your order details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, location.state]);

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">Loading order details...</div>
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
        <section className="checkout-success-banner">
          <div className="checkout-success-icon">✓</div>
          <span className="checkout-eyebrow">ORDER COMPLETED</span>
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been successfully placed.</p>

          <div className="checkout-order-number">
            Order ID: <strong>{order._id}</strong>
          </div>

          <OrderStatus status={order.status} />
        </section>

        <section className="checkout-card">
          <h2 className="checkout-section-title">Ordered Products</h2>

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
          <h2 className="checkout-section-title">Order Details</h2>

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
        </section>

        <section className="checkout-card">
          <h2 className="checkout-section-title">Shipping Address</h2>

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

          <div className="checkout-payment-info">
            <span>Payment Method</span>
            <strong>
              {order.paymentMethod === "cash"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </strong>
          </div>
        </section>

        <Link
          to={`/orders/${order._id}`}
          className="checkout-submit checkout-link-button"
        >
          Track Your Order
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccess;