import { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
//import { useHistory } from 'react-router-dom';


const RatingModal = ({ children }) => {
  const { users } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();
  //const history = useHistory();
  const {slug} = useParams();
  

  const handleModal = () =>{
    if (users && users.token) {
      setModalVisible(true);
    } else {
      navigate('/login', { state: { from: `/product/${slug}` } });
    }
  }
  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined /> <br />{" "}
        {users ? "Leave a rating" : "Login to leave a rating"}
      </div>
      <Modal
        title="Leave a rating"
        centered
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks for your review. It will appear soon!");
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;