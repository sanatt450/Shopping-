import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
const AddProduct = () => {
  // state management logic so that selected image may displayed there on the screen:-
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  const imageHandeler = (e) => {
    setImage(e.target.files[0]);
  };
  const changeHandeler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    //using this we will check our changeHandeler function:-
    console.log(productDetails);
    //now we will add a logic : so that if we click over add button then that data should go to our backend:-
    //we will click over add button so that image will be uploaded: once image is uploaded we will get the url of that image: using that image url we can save our product in the mongoDB database:-

    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append("product", image);
    //now formData has been created now we need to send this data to our API: using fetchAPI--

    await fetch("https://mern-ecom-n5bq.onrender.com/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      //console.log("fetch karne ja rha add product wala")
      //after succesful upload we arre sending our image to add product:-
      await fetch("https://mern-ecom-n5bq.onrender.com/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
        //after this our product will be sent to end point:
        //our backend will upload our product in the mongoDB data base:-
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success
            ? alert("Product added")
            : alert("Product Addition Failed");
        });
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandeler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandeler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandeler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          name="category"
          value={productDetails.category}
          onChange={changeHandeler}
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="ddproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt="upload-img"
          />
        </label>
        <input
          type="file"
          onChange={imageHandeler}
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        className="addproduct-btn"
        onClick={() => {
          Add_Product();
        }}
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
