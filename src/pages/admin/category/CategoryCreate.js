import AdminNav from "../../../components/nav/AdminNav";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify';
import { useSelector } from "react-redux";
import {
    createCategory,
    getCategories,
    removeCategory,
} from "../../../functions/category";
import { Link } from "react-router-dom";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {
    const { users } = useSelector(state => ({ ...state}));
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    //filter step 1. keyword
    const [keyword, setKeyword] = useState("");


    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data));   // get req no need catch

    const handleSubmit = (e) =>{
        e.preventDefault();
        //console.log(name);
        setLoading(true);
        createCategory({name}, users.token)
        .then(res => {
            console.log(res);
            setLoading(false);
            setName('');
            toast.success(`"${res.data.name}" has been created!`);
            loadCategories();
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
        });
    };

    const handleRemove = async (slug) => {
        if(window.confirm("Are you sure you want to deleter?")) {
            setLoading(true)
            removeCategory(slug, users.token)
            .then(res => {
                setLoading(false);
                toast.success(`${res.data.name} already been deleted!`);
                loadCategories();
            })
            .catch(err => {
                if (err.response.status === 400){
                    setLoading(false);
                    toast.error(err.response.data);
                } 
            })
        }
    }

    //Step 4 : higher-order function,check cat name inc incoming keyword
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);



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
                        <h4>Category Create</h4>
                    )}
                    <CategoryForm 
                        handleSubmit= {handleSubmit}
                        name = {name}
                        setName = {setName}
                    />
                    {/* filter step 2 input :input form*/}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />

                    {/* filter step 5 */}

                    {categories.filter(searched(keyword)).map((c) => (
                        <div className="alert alert-secondary" key={c._id}>
                            {c.name} 
                            <span onClick={() => handleRemove(c.slug)} className="btn btn-sm float-end"><DeleteOutlined className="text-danger"/></span>
                            <Link className="btn btn-sm float-end" to={`/admin/category/${c.slug}`}><EditOutlined className="text-warning"/></Link>
                        </div>
                        
                    ))}

                </div>          
            </div>
        </div>
    );
};

export default CategoryCreate;