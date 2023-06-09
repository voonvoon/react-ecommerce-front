import { useState, useEffect } from "react";
import UserNav from "../../../src/components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {DeleteOutlined} from '@ant-design/icons';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { users } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    getWishlist(users.token).then((res) => {
      //console.log(res.data);
      setWishlist(res.data.wishlist); // check console.log for understand
    });
  };

  const handleRemove = (productId) =>
    removeWishlist(productId, users.token).then((res) => {
      loadWishlist(); // reload again
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col-md-9 p-4">
          {wishlist.length > 0 ? (
            <h7>
            {wishlist.map((p) => (
              <div key={p._id} className="alert alert-secondary">
              <img src={p.images[0].url} className="small-photo" />
                <Link to={`/product/${p.slug}`}> {p.title}</Link>
                <span
                  onClick={() => handleRemove(p._id)}
                  className="btn btn-sm float-end"
                ><DeleteOutlined className="text-danger"/></span>
              </div>
            ))}
          </h7>
          ) : "There is nothing in Wishlist."}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
