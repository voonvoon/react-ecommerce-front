

const ShowPaymentInfo = ({ order }) => (
  <div className="order-list">
    <span className="text-muted small ">
      <b>Order Id</b>: {order.paymentIntent.id}
    </span>

    <span className="text-muted small">
      <b>Amount</b>:{" "}
      {(order.paymentIntent.amount /= 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}
    </span>

    <span className="text-muted small">
      <b>currency</b>: {order.paymentIntent.currency.toUpperCase()}
    </span>

    <span className="text-muted small">
      <b>Method</b>: {order.paymentIntent.payment_method_types[0]}
    </span>

    <span className="text-muted small">
      <b>Payment</b>: {order.paymentIntent.status.toUpperCase()}
    </span>

    <span className="text-muted small">
      <b>Ordered On</b>:
      {/* divided by 1000 is necessary to convert the value from seconds to milliseconds. */}
      {new Date(order.paymentIntent.created * 1000).toLocaleString()}  
    </span>
    {/* <span className={`${order.orderStatus === 'Cancelled' ? "badge bg-danger text-white" : "badge bg-primary text-white" } `}> */}
    <span className={`${order.orderStatus}`}>
      <b>Status</b>: {order.orderStatus}
    </span>
  </div>
);

export default ShowPaymentInfo;
