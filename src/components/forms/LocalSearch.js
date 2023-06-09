


const LocalSearch = ({keyword, setKeyword}) => {

    //filter step 3
    const handleSearchChange = (e) => {
        e.preventDefault()
        setKeyword(e.target.value.toLowerCase());

    }

    return (
        <>
            {/* filter step 2 input */}
            <input 
                type="search"
                placeholder="Filter"
                value={keyword}
                onChange={handleSearchChange}
                className="form-control mb-4 mt-4"
            />
        </>
    );
};

export default LocalSearch;