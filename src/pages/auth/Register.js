
import {useState, useEffect} from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";



const Register = () => {

    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const {users} = useSelector((state) => ({...state}));

    useEffect(() => {
        if (users && users.token) navigate("/"); //if only 1 line expression no need {}
    },[users])
 
    console.log(process.env.REACT_APP_REGISTER_REDIRECT_URL)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
            //url:'http://localhost:3000/register/complete',
            handleCodeInApp: true
        }

        await auth.sendSignInLinkToEmail(email, config)
        toast.success(`Email has sent to ${email}. Click the link to complete your registration.`);
        //save user email in local storage
        window.localStorage.setItem('emailForRegistration', email)
        // clear the state
        setEmail('');
    }

    const registerForm = () => <form onSubmit={handleSubmit}>
        <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoFocus    
        />
        <br/>
        <button type="submit" className='btn btn-raised'>Register</button>
    </form>

    return(
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>

                    {registerForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;