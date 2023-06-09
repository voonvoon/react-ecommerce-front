import { useNavigate, useLocation } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {SearchOutlined} from '@ant-design/icons'
import { SEARCH_QUERY } from '../../store/reducers/search';

const Search = () => {
    const dispatch = useDispatch()
    const {search} = useSelector((state) => ({...state}));
    const { text } = search;

    const navigate = useNavigate()

    const handleChange = (e) => {
        dispatch(SEARCH_QUERY(
                 { text: e.target.value }
             )); 
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop?${text}`);
    }

    return (
        <form className='form-inline my-2 my-lg-0 search-inline' onSubmit={handleSubmit}>
            <input 
                onChange={handleChange}
                type='search'
                value={text}  // value control by redux state
                className='form-control mr-sm-2'
                placeholder='Search'
                 
            />
            <SearchOutlined onClick={handleSubmit} style={{ cursor: "pointer" }} />
        </form>
    )
}

export default Search;