import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import LoadingToRedirect from "./LoadingToRedirect";

const AuthGuard = (props) => {    // need pass props cuz need render the children
    const { users } = useSelector((state) => ({ ...state }));
    //let location = useLocation();

    return users && users.token ? (
         props.children
    ) : (
    <LoadingToRedirect />
    );
}

export default AuthGuard;


