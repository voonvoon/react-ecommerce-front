import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";
import { COD_PAY } from "../store/reducers/CODreducer";

const Cart = () => {
  const { cart, users } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0); // 0 is initial value
  };

  const saveOrderToDb = () => {
    // console.log("cart", JSON.stringify(cart, null, 4));
    userCart(cart, users.token).then((res) => {
      console.log("Cart Post Res", res);
      if (res.data.ok) navigate("/checkout");
    })
    .catch((err) => console.log("Cart Save Err", err));
  };

  const saveCashOrderToDb = () => {
     // console.log("cart", JSON.stringify(cart, null, 4));
     dispatch(COD_PAY(true));
     userCart(cart, users.token).then((res) => {
      console.log("Cart Post Res", res);
      if (res.data.ok) navigate("/checkout");
    })
    .catch((err) => console.log("Cart Save Err", err));
  };
  

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} p={p} />
      ))}
    </table>
  );

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart /{cart.length} products</h4>
          {!cart.length ? (
            <p>
              No products in cart.<Link to="/shop"> continue shopping</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = RM {c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total : <b>RM{getTotal()}</b>
          <hr />
          {users ? (
          <>
            <button
              onClick={saveOrderToDb}
              className="btn btn-sm btn-primary mt-2"
              disabled={!cart.length}
            >
              {" "}
              Proceed to checkout
            </button>
            <br/>
            <button
              onClick={saveCashOrderToDb}
              className="btn btn-sm btn-warning mt-2"
              disabled={!cart.length}
            >
              {" "}
              Pay cash on delivery
            </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary mt-2"
              onClick={() => navigate("/login", { state: { from: "/cart" } })}
            >
              Login to checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
