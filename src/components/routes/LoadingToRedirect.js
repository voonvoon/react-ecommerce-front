import { useState, useEffect } from 'react';
import { useHistory,useNavigate } from 'react-router-dom';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5)
    //let history = useHistory()
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount)=> --currentCount);
        }, 1000);
        //redirect once count is equal to 0
        count === 0 && navigate('/')
        //clean up
        return () => clearInterval(interval);
    }, [count]);

    return <div className='container p-5 text-center'>
        <p>Redirecting you in {count} seconds</p>
    </div>
};

export default LoadingToRedirect;