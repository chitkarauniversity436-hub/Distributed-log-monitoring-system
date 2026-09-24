import { useState } from "react";

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: ""
  });

  const [image, setImage] = useState(null);


  // TEXT INPUTS
  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // IMAGE INPUT
  const handleImageChange = (event) => {

    const selectedImage =
      event.target.files[0];

    setImage(selectedImage);

  };


  // SUBMIT
  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      // CREATE FORM DATA
      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "description",
        formData.description
      );


      // ADD IMAGE
      if (image) {

        data.append(
          "image",
          image
        );

      }


      // SEND REQUEST
      const response = await fetch(
        "http://localhost:3002/api/products",
        {
          method: "POST",
          body: data
        }
      );


      const result =
        await response.json();


      // ERROR
      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to create product"
        );

      }


      console.log(
        "Product created:",
        result
      );


      alert(
        "Product created successfully!"
      );


      // RESET FORM
      setFormData({
        name: "",
        price: "",
        description: ""
      });

      setImage(null);


      // RESET FILE INPUT
      document.getElementById(
        "product-image"
      ).value = "";


    } catch (error) {

      console.error(
        "Error creating product:",
        error
      );

      alert(
        error.message
      );

    }

  };


  return (

    <main className="add-product-page">

      <div className="add-product-container">


        {/* HEADER */}

        <div className="add-product-header">

          <h1>
            Add Product
          </h1>

          <p>
            Add a new product to your store.
          </p>

        </div>


        {/* FORM */}

        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >


          {/* NAME */}

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

          </div>


          {/* PRICE */}

          <div className="form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label>
              Product Image
            </label>

            <input
              id="product-image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

          </div>


          {/* SELECTED IMAGE NAME */}

          {image && (

            <p className="selected-image">
              Selected: {image.name}
            </p>

          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="add-product-btn"
          >
            Add Product
          </button>


        </form>

      </div>

    </main>

  );

}

export default AddProduct;