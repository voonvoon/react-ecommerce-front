import { useSelector } from "react-redux";
import { useEffect,useState } from "react";
//import { Navigate, useLocation } from "react-router-dom";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";

const AdminAuthRouth = (props) => {    // need pass props cuz need render the children
    const { users } = useSelector((state) => ({ ...state }));
    const [ok, setOk] = useState(false);
    //let location = useLocation();

    useEffect(() => {
        if(users && users.token) {
            currentAdmin(users.token)
            .then(res => {
                console.log('Current Admin res', res)
                setOk(true)
            })
            .catch((err) => {
                console.log('Admin route err', err);
                setOk(false);
            });
        }
    }, [users])

    return ok ? (
         props.children
    ) : (
    <LoadingToRedirect />
    );
}

export default AdminAuthRouth;