import { Routes, Route, BrowserRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, lazy, Suspense } from "react";
import {LoadingOutlined} from "@ant-design/icons";
//pages
// import Home from "./pages/Home";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Header from "./components/nav/Header";
// import SideDrawer from "./components/drawer/SideDrawer";
// import RegisterComplete from "./pages/auth/RegisterComplete";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import History from "./pages/user/History";
// import AuthGuard from "./components/routes/AuthRouth";
// import AdminAuthRouth from "./components/routes/AdminAuthRouth";
// import Password from "./pages/user/Password";
// import Wishlist from "./pages/user/Wishlist";
// import AdminDashboard from "../src/pages/admin/AdminDashboard";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import SubCreate from "./pages/admin/sub/SubCreate";
// import SubUpdate from "./pages/admin/sub/SubUpdate";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import AllProducts from "./pages/admin/product/AllProducts";
// import Product from "./pages/Product";
// import CategoryHome from "./pages/category/CategoryHome";
// import SubHome from "./pages/sub/SubHome";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import CheckOut from "../src/pages/CheckOut";
// import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
// import Payment from "./pages/Payment";

//function
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "../src/functions/auth";
import { loggedInUser } from "./store/reducers/users";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Header = lazy(() => import("./components/nav/Header"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const History = lazy(() => import("./pages/user/History"));
const AuthGuard = lazy(() => import("./components/routes/AuthRouth"));
const AdminAuthRouth = lazy(() => import("./components/routes/AdminAuthRouth"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminDashboard = lazy(() => import("../src/pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckOut = lazy(() => import("../src/pages/CheckOut"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCouponPage")
);
const Payment = lazy(() => import("./pages/Payment"));

const App = () => {
  const dispatch = useDispatch();

  // to check firebase auth state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        console.log("user", user);

        // dispatch(loggedInUser({
        //   email: user.email,
        //   token: idTokenResult.token,
        // }));

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch(
              loggedInUser({
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
                //testing msg: 'this from the login in pg'
              })
            );
            toast.success("login successfully!");
          })
          .catch((err) => console.log(err));
      }
    });
    // clean up
    return () => unsubscribe();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __React Redux EC
          <LoadingOutlined />
          MMERCE__
        </div>
      }
    >
      <BrowserRouter>
        <Header />
        <SideDrawer />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/complete" element={<RegisterComplete />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route
            path="/user/history"
            element={
              <AuthGuard>
                <History />
              </AuthGuard>
            }
          />
          <Route
            path="/user/password"
            element={
              <AuthGuard>
                <Password />
              </AuthGuard>
            }
          />

          <Route
            path="/user/wishlist"
            element={
              <AuthGuard>
                <Wishlist />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminAuthRouth>
                <AdminDashboard />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/category"
            element={
              <AdminAuthRouth>
                <CategoryCreate />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/category/:slug"
            element={
              <AdminAuthRouth>
                <CategoryUpdate />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/sub"
            element={
              <AdminAuthRouth>
                <SubCreate />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/sub/:slug"
            element={
              <AdminAuthRouth>
                <SubUpdate />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/product"
            element={
              <AdminAuthRouth>
                <ProductCreate />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminAuthRouth>
                <AllProducts />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/admin/product/:slug"
            element={
              <AdminAuthRouth>
                <ProductUpdate />
              </AdminAuthRouth>
            }
          />

          <Route path="/product/:slug" element={<Product />} />

          <Route path="/category/:slug" element={<CategoryHome />} />

          <Route path="/sub/:slug" element={<SubHome />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <AuthGuard>
                <CheckOut />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/coupon"
            element={
              <AdminAuthRouth>
                <CreateCouponPage />
              </AdminAuthRouth>
            }
          />

          <Route
            path="/payment"
            element={
              <AuthGuard>
                <Payment />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
