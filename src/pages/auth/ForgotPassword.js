import {useState, useEffect} from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {users} = useSelector((state) => ({...state}));

    useEffect(() => {
        if (users && users.token) navigate("/"); //if only 1 line expression no need {}
    },[users])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url:process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            //url:'http://localhost:3000/register/complete',
            handleCodeInApp: true
        }

        await auth.sendPasswordResetEmail(email, config)
        .then(() => {
            setEmail('')
            setLoading(false)
            toast.success('Check your email for password reset link');
        })
        .catch((error) => {
            setLoading(false);
            toast.error(error.message);
            console.log("Err msg in forgot pw", error);
        });
    };

    return<div className='container col-md-6 offset-md-3 p-5'>
        {loading ? <h4 className='text-danger'>Loading</h4> : <h4>Forgot Password</h4>}

        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                className='form-control' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoFocus    
                />
                <br/>
                <button className='btn btn-raised' disabled={!email}>Submit</button>
        </form>
    </div>
}

export default ForgotPassword;