import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.png";
import { SET_VISIBLE } from "../../store/reducers/drawerReducer";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "100px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`you have ${cart.length} products in cart`}
      placement="right" // by default is right
      closable={false}
      onClose={() => dispatch(SET_VISIBLE(false))}
      open={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} X {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={laptop} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} X {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}


      <Link to="/cart">
         <button onClick={() => dispatch(SET_VISIBLE(false))} className="text-center btn btn-primary btn-raised btn-block">
                Go To Cart
         </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
