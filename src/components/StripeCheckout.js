import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link } from "react-router-dom";
import { createOrder, emptyUserCart } from "../functions/user";
import { ADD_TO_CART } from "../store/reducers/cartReducer";
import {COUPON_APPLIED} from "../store/reducers/CouponReducer";

import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import Laptop from "../images/microsoft.jpg";

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const { users, coupon } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  // 1st when comp mount , get the secret, we need the secret when we submit the form

  useEffect(() => {
    // send coupon status from redux to backend
    createPaymentIntent(users.token, coupon).then((res) => {
      console.log("create payment intent", res.data);
      setClientSecret(res.data.clientSecret); // cuz we receive in tis: {"clientSecret":"pi_3NDkggBk4Pnl7fUR0arm1bIm_secret_vWsAyAQ88KkaXnWFExSjObC8v"}
      //additional res received on success payment
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here u get result after successful payment
      // create order & save in db for admin to process

      createOrder(payload, users.token).then((res) => {
        if (res.data.ok) {
          //empty local storage cart
          if (typeof window !== "undefined") localStorage.removeItem("cart");
          //empty redux cart
          dispatch(ADD_TO_CART([]));

          //reset coupon to false in redux
          dispatch(COUPON_APPLIED(false));
          //empty db cart
          emptyUserCart(users.token);
        }
      });
      //empty user cart from redux & local storage
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    //listen for changes in the card element
    //and display any errors as cust typing
    setDisabled(e.empty); // disable pay btn if errors
    setError(e.error ? e.error.message : ""); // show error msg  ; e.error.message from stripe module
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {/* below coupon from redux */}
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">{`Coupon applied! Total after discount: RM ${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No Coupon applied!</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={Laptop}
              style={{
                height: "150px",
                objectFit: "contain",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br /> Total: RM
              {cartTotal}
            </>,

            <>
              <CheckOutlined className="text-info" /> <br /> Total Payable: RM
              {(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>

      <form id="payment_form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />

        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {/* below error from our state */}
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successfully made!
          <Link to="/user/history"> Check out on your purhchase history</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
