import AdminNav from "../../../components/nav/AdminNav";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify';
import { useSelector } from "react-redux";
import {
    getCategory,
    updateCategory,
} from "../../../functions/category";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import CategoryForm from '../../../components/forms/CategoryForm';


const CategoryUpdate = () => {
    const { users } = useSelector(state => ({ ...state}));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    let {slug} = useParams()

    useEffect(() => {
        loadCategory();
    }, [])

    const loadCategory = () =>
        getCategory(slug).then((c) => setName(c.data.name));   // get req no need catch

    const handleSubmit = (e) =>{
        e.preventDefault();
        //console.log(name);
        setLoading(true);
        updateCategory(slug, {name}, users.token)
        .then(res => {
            console.log(res);
            setLoading(false);
            setName('');
            toast.success(`"${res.data.name}" has been updated!`);
            navigate('/admin/category');

        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
        });
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className="col">
                {loading ? (
                    <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Update Category</h4>
                    )}
                    <CategoryForm 
                        handleSubmit= {handleSubmit}
                        name = {name}
                        setName = {setName}
                    />
                    <hr/>
                    
                </div>         
            </div>
        </div>
    );
};

export default CategoryUpdate;