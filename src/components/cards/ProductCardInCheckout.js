import ModalImage from "react-modal-image";
import laptop from "../../images/laptop.png";
import { ADD_TO_CART } from "../../store/reducers/cartReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];

  let dispatch = useDispatch();

  const handleColorChange = (e) => {
    //console.log("color changed", e.target.value);

    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          // if product id in localstorage === each product id we receive from parent component(Cart.js)
          // if don't check like tis it will update other product simultenously
          cart[i].color = e.target.value;
        }
      });

      //console.log('cart update color', cart)
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(ADD_TO_CART(cart));
    }
  };

  const handleQuantityChange = (e) => {
    //console.log("availabe qty", p.quantity)
    let count = e.target.value < 1 ? 1 : e.target.value; // mk sure value won't less than 1

    if (count > p.quantity) {
      toast.error(`Sorry currently only have ${p.quantity} stocks available`);
      return; // must return else rest of the code will execute.
    }

    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].count = count;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(ADD_TO_CART(cart));
    }
  };

  const handleRemove = () => {
    //console.log("To remove", p._id)
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          // if product id in localstorage === each product id we receive from parent component(Cart.js)
          // if don't check like tis it will update other product simultenously
          cart.splice(i, 1);  // splice(index, how many item to be taken out)
        }
      });

      //console.log('cart update color', cart)
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(ADD_TO_CART(cart));
    }
  }

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {p.images.length ? (
              <ModalImage small={p.images[0].url} large={p.images[0].url} />
            ) : (
              <ModalImage small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td>{p.title}</td>
        <td>RM{p.price}</td>
        <td>{p.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            //className="form-control"
          >
            {p.color ? (
              <option value={p.color}>{p.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((c) => c !== p.color)
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            type="number"
            className="form-control p-1"
            value={p.count}
            onChange={handleQuantityChange}
          />
        </td>
        <td className="text-center">
          {p.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success"/>
          ) : (
            <CloseCircleOutlined className="text-danger"/>
          )}
        </td>
        <td className="text-center"><CloseOutlined onClick={handleRemove} className="text-danger"/></td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
