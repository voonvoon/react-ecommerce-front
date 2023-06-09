import { useEffect, useState } from "react";
import { getProduct, productStar } from "../functions/product";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";

const Product = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);

  //redux
  const { users } = useSelector((state) => ({ ...state }));

  let { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]); //run when slug changes

  useEffect(() => {
    if (product.ratings && users) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === users._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user star
    }
  });

  const loadSingleProduct = () => {
    // 1st load single product
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // imediately load related, we get _id from above res.data
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    console.table(newRating, name);
    productStar(name, newRating, users.token).then((res) => {
      console.log("rating clicked", res.data);
      loadSingleProduct(); //if want to show updated rating in real time
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>

      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Products you might interested too:</h4>
          <hr />
        </div>
      </div>

      <div className="row pb-5">
        {related.length
          ? related.map((r) => (
              <div key={r._id} className="col-md-4">
                {" "}
                <ProductCard product={r} />{" "}
              </div>
            ))
          : <div className="text-center col">No related Product found</div>}
      </div>
    </div>
  );
};

export default Product;
