import OrderItem from "./OrderItem";

function OrderSummary({ items = [], subtotal, discount, total }) {
  return (
    <section className="checkout-card">
      <h2 className="checkout-section-title">Order Summary</h2>

      <div className="checkout-items-list">
        {items.map((item, index) => (
          <OrderItem
            key={item._id || item.product || index}
            item={item}
          />
        ))}
      </div>

      <div className="checkout-price-details">
        <div>
          <span>Subtotal</span>
          <strong>{Number(subtotal || 0).toFixed(2)}</strong>
        </div>

        <div>
          <span>Discount</span>
          <strong className="checkout-discount">
            -{Number(discount || 0).toFixed(2)}
          </strong>
        </div>

        <div className="checkout-total">
          <span>Total</span>
          <strong>{Number(total || 0).toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}

export default OrderSummary;