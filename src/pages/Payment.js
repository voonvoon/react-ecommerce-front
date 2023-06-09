import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from '../components/StripeCheckout';
import '../stripe.css';

// load stripe outside of component render to avoid recreating stripe obj on every render.
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
  return (
    <div className="container p-5 text-center">
        <h4>Complete Your Purhchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
            <StripeCheckout />
        </div>
      </Elements>
    </div>
  );
};

export default Payment;
