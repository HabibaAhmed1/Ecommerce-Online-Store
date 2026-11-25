const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrderStatus({ status }) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  return (
    <span className={`order-status status-${normalizedStatus}`}>
      {STATUS_LABELS[normalizedStatus] || normalizedStatus}
    </span>
  );
}

export default OrderStatus;