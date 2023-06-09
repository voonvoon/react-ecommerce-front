import { useEffect, useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify';

import { Link } from "react-router-dom";

import firebase from "firebase/compat/app";  // require to implement logout
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Search from "../forms/Search";

import {logoutUser} from '../../store/reducers/users';


const { SubMenu, Item } = Menu;


const Header = () => {

  const [current, setCurrent] = useState("home");
  //const [currentCartLength, setCurrentCartLength] = useState("");
  
  let dispatch = useDispatch();
  const {users, cart} = useSelector((state) => ({...state}));


  const navigate = useNavigate();

  // useEffect(() => {
  //   setCurrentCartLength(cart.length);
  // }, [cart]);

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut()
    dispatch(logoutUser(null));

    toast.success('Logout successfully!')
    navigate("/login");

  }

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="menu-main">
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to='/'>Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to='/shop'>Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to='/cart'>
          <Badge count={cart.length} offset={[9,0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!users &&(
        <Item key="register" icon={<UserAddOutlined />} className="align-right1">
      <Link to='/register'>Register</Link>
      </Item>
      )}

      {!users && (
        <Item key="login" icon={<UserOutlined />} className="align-right2">
      <Link to='/login'>Login</Link>
      </Item>
      )}

      { users && (
        <SubMenu icon={<SettingOutlined />} title={users.email && users.email.split("@")[0]} className="align-right1" key="sub-menu-key">
          {users && users.role === 'subscriber' && (<Item><Link to="/user/history">Dashboard</Link></Item>)}
          {users && users.role === 'admin' && (<Item><Link to="/admin/dashboard">Dashboard</Link></Item>)}
          <Item icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
      </SubMenu>
      )}

      <span className="float-right p-1 align-right3">
        <Search />
      </span>
      
    </Menu>
  );
};

export default Header;