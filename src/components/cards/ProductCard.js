import { useState } from "react";

import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART } from "../../store/reducers/cartReducer";
import { SET_VISIBLE } from "../../store/reducers/drawerReducer";
const { Meta } = Card;

const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click to add");

  //Redux
  const { users, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // means we hv window object, localstorage also part of window object
      // if cart is in localstorage GET it, cuz user might hv add it earlier.
      if (localStorage.getItem("cart")) {
        // if can get 'cart' from local storage
        cart = JSON.parse(localStorage.getItem("cart")); // parse it so can store in cart[] as jvs object.
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual); // method from lodash(npm) , check docs for more info, it get rid of duplicate item
      // save to local storage
      //console.log('unique', unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      //show tooltip
      setTooltip("Added");

      //add to redux state
      dispatch(ADD_TO_CART(unique));

      //show card item in side drawer
      dispatch(SET_VISIBLE(true));
    }
  };

  //destructure
  const { images, title, description, slug, price } = product;

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">Be the first to rate now!</div>
      )}

      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "150px", objectFit: "contain" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a
              onClick={handleAddToCart}
              disabled={product.quantity < 1}
              style={{ pointerEvents: product.quantity < 1 ? "none" : "auto" }}
            >
              <ShoppingCartOutlined className="text-danger" /> <br />
              {product.quantity < 1 ? "Out Of Stock" : "Add To Cart"}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - RM ${price}`}
          description={`${description && description.substring(0, 50)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
