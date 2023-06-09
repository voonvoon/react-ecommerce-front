import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import {COD_PAY} from "../store/reducers/CODreducer";
import {COUPON_APPLIED} from "../store/reducers/CouponReducer";
import { ADD_TO_CART } from "../store/reducers/cartReducer";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CheckOut = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, cod } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);  // avoid errro cuz coupon alrd used in useState.

  useEffect(() => {
    getUserCart(users.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.cart.products);
      setTotal(res.data.cart.cartTotal);
    });
  }, []);

  const saveAddressToDb = () => {
    //console.log(address);
    saveUserAddress(users.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address has been saved.");
      }
    });
  };

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch(ADD_TO_CART([]));
    // remove from backend
    emptyUserCart(users.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      dispatch(COUPON_APPLIED(false));
      toast.success("Cart is empty, please continue shopping!");
    });
  };

  const applyDiscountCoupon = () => {
    //console.log("send coupon to backend", coupon);
    applyCoupon(users.token, coupon).then((res) => {
      console.log("Res on coupon applied", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true / false
        dispatch(COUPON_APPLIED(true));
      }
      // error
      if (res.data.err) {
        // in backend we use err so ok access tis way.
        setDiscountError(res.data.err);
        // update redux coupon applied true / false
        dispatch(COUPON_APPLIED(false));
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        {" "}
        Save{" "}
      </button>
    </>
  );

  const showProductSummary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) X {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));
  };

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  const createCashOrder = () => {
    createCashOrderForUser(users.token, cod, couponTrueOrFalse).then(res => {  //cod from redux, has value true or false
      console.log('User cash order created res', res)
      //empty cart from redux , local storage, reset coupon, redirreset cod, ect
      if(res.data.ok) {
        //empty local storage
        if(typeof window !== 'undefined') localStorage.removeItem('cart')
        //empty redux cart
        dispatch(ADD_TO_CART([]));
        //empty redux coupon
        dispatch(COUPON_APPLIED(false));
        //empty redux cod
        dispatch(COD_PAY(false));
        //empty cart from backend
        emptyUserCart(users.token);
        //redirect, to ensure all data in place b4 user been redirect, use setTimeOut()
        setTimeout(() => {
          navigate('/user/history');
        }, 2000);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {/* in ReactQuill onchange no need use event handler, abit different than regular html ele*/}
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && (
          <span className="text-danger p-2">{discountError}</span>
        )}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>

        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: RM {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="text-success">
            Discount applied <br /> Total payable: RM{totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {cod ? (
              <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length ? true : false}
              onClick={createCashOrder}
            >
              Place Order(Cash on delivery)
            </button>
            ) : (
              <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length ? true : false}
              onClick={() => navigate("/payment")}
            >
              Place Order
            </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              onClick={emptyCart}
              disabled={!products.length}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
