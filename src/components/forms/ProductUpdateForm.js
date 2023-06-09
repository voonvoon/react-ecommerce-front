import { Select, Space } from "antd";

const { Option } = Select;

const ProductUpdateForm = ({
  handleSubmit,
  handleChange,
  values,
  setValues,
  handleCategoryChange,
  subOptions,
  categories,
  arrayOfSubsIds,
  setArrayOfSubIds,
  selectedCategory
}) => {
  // destructure
  const {
    title,
    description,
    price,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title} // cuz we destructre values already. b4 is values.title
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={description} // cuz we destructre values already. b4 is values.title
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={price} // cuz we destructre values already. b4 is values.title
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Shipping</label>
        <select
          value={shipping === "Yes" ? "Yes" : "No"}
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity} // cuz we destructre values already. b4 is values.title
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Color</label>
        <select value={color} name="color" className="form-control" onChange={handleChange}>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand</label>
        <select value={brand} name="brand" className="form-control" onChange={handleChange}>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCategoryChange}
          value={selectedCategory ? selectedCategory : category._id}
        >
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label>Sub categories</label>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="please Select"
          value={arrayOfSubsIds}  // check ant doc for details, ant require[{id},{id}] , ! object
          onChange={(value) => setArrayOfSubIds(value)} // check ant design docs
        >
          {
            subOptions.length &&
              subOptions.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              )) // save value as id only
          }
        </Select>
      </div>

      <br />

      <button className="btn btn-outline-info mt-2">Save</button>
    </form>
  );
};

export default ProductUpdateForm;
