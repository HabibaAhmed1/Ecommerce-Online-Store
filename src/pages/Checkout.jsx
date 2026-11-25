import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cart.api";
import { placeOrder } from "../api/order.api";

import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "Egypt",
    city: "",
    address: "",
    postalCode: "",
    customerNote: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCart();
        setCart(response.data);
      } catch (err) {
        setError("Unable to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!cart?.items?.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          country: formData.country.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
          postalCode: formData.postalCode.trim(),
        },
        paymentMethod,
        customerNote: formData.customerNote.trim(),
      };

      const response = await placeOrder(orderData);
      const order = response.data?.order;

      if (!order?._id) {
        throw new Error("The order was created but its ID was not returned.");
      }

      navigate(`/order-success/${order._id}`, {
        state: { order },
      });
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "Unable to place your order. Please check your cart and shipping information."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">Loading your cart...</div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="checkout-page">
        <div className="checkout-message checkout-error">
          {error}
        </div>
      </main>
    );
  }

  if (!cart?.items?.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add some products before proceeding to checkout.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <span className="checkout-eyebrow">YOUR PURCHASE</span>
          <h1>Checkout</h1>
          <p>Complete your shipping information to place your order.</p>
        </header>

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-main-column">
            <ShippingForm
              formData={formData}
              onChange={setFormData}
            />

            <PaymentMethod
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            {error && (
              <div className="checkout-alert checkout-error" role="alert">
                {error}
              </div>
            )}
          </div>

          <aside className="checkout-side-column">
            <OrderSummary
              items={cart.items}
              subtotal={cart.subtotal}
              discount={cart.discountAmount}
              total={cart.total}
            />

            <button
              type="submit"
              className="checkout-submit"
              disabled={submitting}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <p className="checkout-secure-note">
              Your order total will be confirmed by the server.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;