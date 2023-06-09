import AdminNav from "../../../components/nav/AdminNav";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

import { getCategories, getCategorySubs } from "../../../functions/category";

import FileUpload from "../../../components/forms/FileUpload";

import { useParams } from "react-router-dom";
import { getProduct,updateProduct } from "../../../functions/product";
import { useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "HP", "Toshiba"],
  color: "",
  brand: "",
};

const ProductUpdate = () => {
  // state
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubsIds , setArrayOfSubIds] = useState([]);
  const [selectedCategory , setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
 
  const { users } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  // router
  let { slug } = useParams();

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      //console.log('Single product', p);
      //1. load single product
      setValues({ ...values, ...p.data });
      //2. load single product category subs
      getCategorySubs(p.data.category._id)
      .then((res) => {
        setSubOptions(res.data); // on first load, show default subs
      });
     // 3. prepare array of sub ids to show as default sub value in antd Select
     let arr = []
     p.data.subs.map((s) => {
      arr.push(s._id);
     });
     console.log("ARR", arr);
     setArrayOfSubIds((prev) => arr); // required by ant design to works  //((prev)=> arr) is mk sure it updata from prv to new. 
    });
  };

  const loadCategories = () =>
    getCategories().then((c) => {
      console.log("Get Category in update product", c.data);
      setCategories(c.data);
    }); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)

    values.subs = arrayOfSubsIds;
    values.category = selectedCategory ?selectedCategory : values.category;

    updateProduct(slug, values, users.token)
    .then(res => {
      setLoading(false)
      toast.success(`"${res.data.title}" is updated!`)
      navigate('/admin/products');
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data.err);
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    //console.log(e.target.name, "-->", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("Clicked category", e.target.value);
    setValues({ ...values, subs: [] }); // when cat click set subs to [] prevent bug.

    setSelectedCategory(e.target.value);

    getCategorySubs(e.target.value).then((res) => {
      console.log("Sub options on category click", res);
      setSubOptions(res.data);
    });

    console.log("Existing Category value.category", values.category);

    //if use click bc original cat
    // show its sub cat in default
    if(values.category._id === e.target.value){
      loadProduct();
    }
    // clear old sub id
    setArrayOfSubIds([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
        {loading ? (
            <LoadingOutlined
              className="text-danger h1"
              style={{
                fontSize: '4em',
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
            />
          ) : (
            <h4>Product Update</h4>
          )}
          {/* {JSON.stringify(values)} */}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues} 
            values={values}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubsIds={arrayOfSubsIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
