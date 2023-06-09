import AdminNav from "../../../components/nav/AdminNav";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

import ProductCreateForm from "../../../components/forms/productCreateForm";

import { getCategories, getCategorySubs } from "../../../functions/category";

import FileUpload from "../../../components/forms/FileUpload";

const initialState = {
  title: "Macbook PRO2",
  description:
    "omg this is the best laptop and i not even kidding with you right now !",
  price: "4500",
  categories: [],
  category: "",
  subs: [],
  shipping: "Yes",
  quantity: "50",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "HP", "Toshiba"],
  color: "White", // tis use to create tis product
  brand: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false); // for hide and show
  const [loading, setLoading] = useState(false);

  const { users } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data })); // get req no need catch

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, users.token)
      .then((res) => {
        console.log(res);
        window.alert(`"${res.data.title}" was created.`); // not use toast cuz need reload
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        //if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err); // tis how to get actually err msg. the err hv to match server side controller.
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    //console.log(e.target.name, "-->", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("Clicked category", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value }); // when cat click set subs to [] prevent bug.
    getCategorySubs(e.target.value).then((res) => {
      console.log("Sub options on category click", res);
      setSubOptions(res.data);
    });
    setShowSub(true);
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
            <h4>Product Create</h4>
          )}
          <hr />

          {/* {JSON.stringify(values.images)} */}

          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues} // can pass setValues as props as well
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
