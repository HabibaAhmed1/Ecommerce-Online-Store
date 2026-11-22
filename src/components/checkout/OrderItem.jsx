function OrderItem({ item }) {
  return (
    <div className="checkout-order-item">
      <div className="checkout-item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="checkout-item-info">
        <h4>{item.name}</h4>
        <p>Quantity: {item.quantity}</p>
      </div>

      <strong className="checkout-item-price">
        {(Number(item.price) * Number(item.quantity)).toFixed(2)}
      </strong>
    </div>
  );
}

export default OrderItem;