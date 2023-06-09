import AdminNav from "../../../../src/components/nav/AdminNav";
import {
  getProductsByCount,
  removeProduct,
} from "../../../../src/functions/product";
import { useEffect, useState } from "react";
import AdminProductCard from "../../../../src/components/cards/AdminProductCard";
import {toast} from "react-toastify";
import {useSelector} from 'react-redux';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  //redux
  const {users} = useSelector((state) => ({ ...state}));

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100) //hard code for now
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRemove = (slug) => {
    let answer = window.confirm("There is no turn back.delete?");
    if (answer) {
      //console.log("Send delete req", slug);
      removeProduct(slug, users.token)
      .then((res) => {
        loadAllProducts();
        toast.error(`${res.data.title} is deleted!`);
      })
      .catch((err) => {
        if(err.response.status === 400) toast.error(err.response.data);
        console.log(err);
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>All Products</h4>
          )}

          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 pb-3">
                <AdminProductCard
                  product={product}
                  handleRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
