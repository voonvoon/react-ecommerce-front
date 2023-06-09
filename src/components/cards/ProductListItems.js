import { Link } from "react-router-dom";

const ProductListItems = ({ product }) => {
  const { price, subs, category, shipping, color, brand, quantity, sold } = product;

  return (
    <ul className="list-group">
      <li className="list-group-item own-single-description">
        <span>Price</span>
        <span className="label">$ {price}</span>
      </li>

      {category && (
        <li className="list-group-item own-single-description">
          <span>Category</span>
          <Link to={`/category/${category.slug}`} className="label">
            {category.name}
          </Link>
        </li>
      )}

      {subs && (
        <li className="list-group-item own-single-description2 ">
          <span>Sub Categories</span>
          {subs.map((s) => (
            <Link key={s._id} to={`/sub/${s.slug}`} className="label">{s.name}</Link>
          ))}
        </li>
      )}

      <li className="list-group-item own-single-description">
        <span>Shipping</span>
        <span className="label">{shipping}</span>
      </li>

      <li className="list-group-item own-single-description">
        <span>Color</span>
        <span className="label"> {color}</span>
      </li>

      <li className="list-group-item own-single-description">
        <span>Brand</span>
        <span className="label">{brand}</span>
      </li>

      <li className="list-group-item own-single-description">
        <span>Available</span>
        <span className="label">{quantity}</span>
      </li>

      <li className="list-group-item own-single-description">
        <span>Sold</span>
        <span className="label">{sold}</span>
      </li>
    </ul>
  );
};

export default ProductListItems;
