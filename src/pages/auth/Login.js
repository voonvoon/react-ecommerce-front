import { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button, Result } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUser } from "../../store/reducers/users";
import { useNavigate, useLocation } from "react-router-dom";
//import { async } from '@firebase/util';
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../../src/functions/auth";

//import { useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("hvlifeasy@gmail.com");
  const [password, setPassword] = useState("123321");
  const [loading, setLoading] = useState(false);

  //const location = useLocation();
  //const { from } = location.state;

  //console.log('from', from)

  const navigate = useNavigate();
  const location = useLocation();

  const { users } = useSelector((state) => ({ ...state }));
  console.log('voon', users)
  let dispatch = useDispatch();

  useEffect(() => {
    let intended = location.state;
    if (intended) {
      return;
    } else {
      if (users && users.token) navigate("/");
    }
  }, [users]);

  const roleBaseRedirect = (res) => {
    // check if intended
    let intended = location.state;
    if (intended) {
      navigate(intended.from);
    } else {
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/history");
      }
    }
  };



  // useEffect(() => {
  //     if (users && users.token) navigate("/"); //if only 1 line expression no need {}
  // },[users])

  console.log(process.env.REACT_APP_REGISTER_REDIRECT_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //console.table(email,password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      //console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch(
            loggedInUser({
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            })
          );
          roleBaseRedirect(res);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch(
              loggedInUser({
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              })
            );
            roleBaseRedirect(res);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      <br />
      {/* <button type="submit" className='btn btn-raised'>Login</button> */}
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}

          {loginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="google-button mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>

          <Link to="/forgot/password" className="text-danger">
            Forgot password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
