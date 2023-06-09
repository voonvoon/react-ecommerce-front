import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";


const FileUpload = ({ values, setValues, setLoading }) => {
  const { users } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    //console.log(e.target.files);
    //resize
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            //console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: users ? users.token : "",
                  },
                }
              )
              .then((res) => {
                console.log("image upload res data", res);
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("Cloudinary upload error", err);
              });
          },
          "base64"
        );
      }
    }
    // send back to server to upload to cloudinary
    //set url to images[] in parant component - productCreate
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    //console.log("remove img", id);
    axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id},
    {
        headers: {
            authtoken: users ? users.token : "",
        },
    })
    .then(res => {
        setLoading(false)
        const { images } = values
        //filter out item not match the id, all here except d 1 already deleted
        let filteredImages = images.filter((item) => {
            return item.public_id !== public_id
        });
        setValues({ ...values, images: filteredImages });

    })
    .catch((err) => {
        console.log(err);
        setLoading(false);
    });
  };

  return (
    <>
      <div>
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              className="m-2"
              style={{ cursor: "pointer" }}
              key={image.public_id}
              onClick={() => handleImageRemove(image.public_id)}
            >
              <Avatar src={image.url} size={100} shape="square" />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary btn-raised mt-3" style={{ width: '150px' }}>
          Upload Images
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
