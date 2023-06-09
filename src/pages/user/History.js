import { useState, useEffect } from "react";
import UserNav from "../../../src/components/nav/UserNav";
import { getUserOrders } from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo';
import {
    PDFDownloadLink,
  } from "@react-pdf/renderer";

import Invoice from '../../components/order/Invoice';

const History = () => {
  const [orders, setOrders] = useState([]);
  const { users } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () =>
    getUserOrders(users.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });

  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>

      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td>
              <b>{p.product.title}</b>
            </td>
            <td>{p.product.price}</td>
            <td>{p.product.brand}</td>
            <td>{p.color}</td>
            <td>{p.count}</td>
            <td>
              {p.product.shipping === "Yes" ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : (
                <CloseCircleOutlined style={{color: 'red'}}/>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink document={
         <Invoice order={order} />
    }
    fileName="invoice.pdf"
    className="btn btn-sm btn-block btn-outline-primary"
    >
       Download PDF
    </PDFDownloadLink>
  )
  

  const showEachOrders = () =>
    orders.reverse().map((order, i) => (     // reverse() so new order appear on top
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order}/>
        <br/>
        {showOrderInTable(order)}
        
        <div className="row">
          <div className="col">
            {showDownloadLink(order)}
          </div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {orders.length > 0
              ? "User's Purchase Orders"
              : "There is no order yet."}
          </h4>
          {showEachOrders()}
        </div>
      </div>
    </div>
  );
};

export default History;
