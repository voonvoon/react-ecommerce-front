import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";

import "react-datepicker/dist/react-datepicker.css"; // need tis css for react-datepicker
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, SetLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  const { users } = useSelector((state) => ({ ...state }));

  const loadAllCoupons = () => {
    getCoupons().then((res) => setCoupons(res.data));
  }

  useEffect(() => {
    loadAllCoupons()
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    SetLoading(true);
    //console.log(name, expiry, discount);
    createCoupon({ name, expiry, discount }, users.token)
      .then((res) => {
        SetLoading(false);
        loadAllCoupons();
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`"${res.data.name}" has been created`);
      })
      .catch((err) => console.log("Create coupon err", err));
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Are you sure you want to delete the coupon?")) {
      SetLoading(true);
      removeCoupon(couponId, users.token)
        .then((res) => {
          loadAllCoupons();
          SetLoading(false);
          toast.error(`coupon name "${res.data.name}" has been deleted!`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              ></input>
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              ></input>
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry Date</label>
              <br />
              <div className="custom-date-picker">
                <DatePicker
                  className="form-control"
                  selected={new Date()}
                  value={expiry}
                  onChange={(date) => setExpiry(date)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-outline-primary mt-4">
              Create Coupon
            </button>
          </form>

          <br />
          <h4>{coupons.length} Coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Discount%</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(c._id)}
                      //onClick={() => console.log(c._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
