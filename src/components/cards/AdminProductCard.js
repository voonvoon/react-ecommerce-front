import { Link } from "react-router-dom";  
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { Card } from "antd";
const { Meta } = Card;

// handleRemove pass as prop from parant cuz we need update state in parent.

const AdminProductCard = ({ product, handleRemove }) => {
  // destructure
  const { title, description, images, slug } = product;
  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : laptop}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined
          onClick={() => handleRemove(slug)}
          className="text-danger"
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 50)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
