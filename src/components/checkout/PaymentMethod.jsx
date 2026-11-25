const PAYMENT_METHODS = [
  {
    value: "cash",
    label: "Cash on Delivery",
    description: "Pay when your order arrives.",
  },
];

function PaymentMethod({ value, onChange }) {
  return (
    <section className="checkout-card">
      <h2 className="checkout-section-title">Payment Method</h2>

      <div className="checkout-payment-options">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.value}
            className={`checkout-payment-option ${
              value === method.value ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={value === method.value}
              onChange={() => onChange(method.value)}
            />

            <span className="checkout-payment-radio" />

            <span>
              <strong>{method.label}</strong>
              <small>{method.description}</small>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default PaymentMethod;