import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";

import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { useState, useEffect } from "react";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { SEARCH_QUERY } from "../store/reducers/search";
import Star from "../components/forms/Stars";

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]); // default is 0 ,0
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]); // send to backend to search
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]); //tis is all subs avai in db
  const [sub, setSub] = useState([]); //this is after click what will show up
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "Asus",
    "HP",
    "Toshiba",
  ]);

  const [brand, setBrand] = useState(""); // tis single brand user clicked
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();

  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
    // fetch sub categories
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  //1. load products by default on pg load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  //2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text }); // cuz in bc end :const {query} = req.body
      if(!text) {
        loadAllProducts();
      }; // add tis if statement, so all products will load even there is no text in search field, else will hv bug
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  //3. load products based on price range
  useEffect(() => {
    console.log("ok to request");
    fetchProducts({ price: price });
  }, [ok]);

  const handleSlider = (value) => {
    //reset
    dispatch(SEARCH_QUERY({ text: "" }));
    setCategoryIds([]);
    setPrice(value);
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    setTimeout(() => {
      setOk(!ok); // toggle it cuz useEffect dependency detact any changes here, does't matter true or false
    }, 300);
  };

  //4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)} //checks if the c._id exists in the categoryIds array. yes return true then checked by default
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  // handle check for categories
  const handleCheck = (e) => {
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    //console.log(e.target.value);
    let inTheState = [...categoryIds]; // gv us whatever ids already in the state
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // return index or -1

    // indexOf method ?? if not found returns -1 else return index
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out 1 item from index
      inTheState.splice(foundInTheState, 1); // splice(index, how many item);
    }

    setCategoryIds(inTheState);
    console.log(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    //console.log(num);
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setCategoryIds([]); //clear Cat id
    setStar(num);
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  // 6 show products by sub cat
  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    ));

  const handleSub = (sub) => {
    //console.log("SUB", sub);
    setSub(sub);
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setCategoryIds([]); //clear Cat id
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    fetchProducts({ sub: sub });
  };

  // 7. show products base on brand name
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSub("");
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setCategoryIds([]); //clear Cat id
    setStar("");
    setBrand(e.target.value);
    setColor("");
    setShipping("");
    fetchProducts({ brand: e.target.value });
  };

  // 8. show products base on colors

  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    setSub("");
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setCategoryIds([]); //clear Cat id
    setStar("");
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  // 9. show products base on shipping yes or no

  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingChange = (e) => {
    setSub("");
    dispatch(SEARCH_QUERY({ text: "" })); // clear redux
    setPrice([0, 0]); // clear price
    setCategoryIds([]); //clear Cat id
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value)
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            {/* Price */}
            <SubMenu
              key="1"
              title={
                <span className="h6 price-inline">
                  <DollarOutlined className="p-1" />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `RM ${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>
            {/* Categories */}
            <SubMenu
              key="2"
              title={
                <span className="h6 price-inline">
                  <DownSquareOutlined className="p-1" />
                  Categories
                </span>
              }
            >
              <div style={{ marginTop: "-6px" }}>{showCategories()}</div>
            </SubMenu>

            {/* Stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6 price-inline">
                  <StarOutlined />
                  Rating
                </span>
              }
            >
              <div style={{ marginTop: "0px" }}>{showStars()}</div>
            </SubMenu>

            {/* Sub Categories */}
            <SubMenu
              key="4"
              title={
                <span className="h6 price-inline">
                  <DownSquareOutlined className="p-1" />
                  Sub Categories
                </span>
              }
            >
              <div style={{ marginTop: "0px" }} className="pl-4 pr-4">
                {showSubs()}
              </div>
            </SubMenu>

            {/* brand */}
            <SubMenu
              key="5"
              title={
                <span className="h6 price-inline">
                  <DownSquareOutlined className="p-1" />
                  Brands
                </span>
              }
            >
              <div style={{ marginTop: "0px" }} className="pr-5">
                {showBrands()}
              </div>
            </SubMenu>

            {/* Colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6 price-inline">
                  <DownSquareOutlined className="p-1" />
                  Colors
                </span>
              }
            >
              <div style={{ marginTop: "0px" }} className="pr-5">
                {showColors()}
              </div>
            </SubMenu>

            {/* Shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6 price-inline">
                  <DownSquareOutlined className="p-1" />
                  Shipping
                </span>
              }
            >
              <div style={{ marginTop: "0px" }} className="pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger text-center">Loading..</h4>
          ) : (
            <h4 className="text-danger text-center">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
