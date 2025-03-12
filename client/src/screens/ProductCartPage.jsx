import React, { useState } from "react";
import { useGlobalData } from "../context/contextApiProvider";
import Layout from "../components/Layout/Layout";
import { createOrderFunction } from "../serviceApi/servicesApi";
import { toast } from "react-toastify";
import { Container } from "react-bootstrap";

const ProductCartPage = () => {
  const [globalData, setGlobalData, addToCart] = useGlobalData();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  console.log("globalData", globalData);
  //? FORM CHANGE HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log("formData", formData);
  };

  //? CHECK ERROR
  const errorFunction = () => {
    if (globalData.length == 0) {
      setError("Atleast one product is required");
      return;
    }
    if (!formData.firstName) {
      setError("First name is required");
      return;
    }
    if (!formData.lastName) {
      setError("Last name is required");
      return;
    }
    if (!formData.address) {
      setError("address is required");
      return;
    }

    setError("");
    return true;
  };

  //? FORM SUBMIT HANDLER
  const handleSubmit = async () => {
    const isValid = errorFunction();
    if (!isValid) return;

    const result = await createOrderFunction({
      ...formData,
      cart: globalData,
    });
    if (result.status == 200) {
      toast.success(result.data.message);
      console.log("Order details are", { cart: globalData, ...formData });
    }
  };
  // ! JSX START
  return (
    <Layout>
      <Container>
        <h2 style={{ textAlign: "center", marginTop: "10px" }}>Cart</h2>
        {globalData.map((item, index) => (
          <div key={index}>
            <h4>
              {item.name} : &#8377;{item.price}
            </h4>
          </div>
        ))}
        <h3>
          Total: &#8377;
          {globalData.reduce((total, item) => total + item.price, 0)}
        </h3>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={(e) => handleChange(e)}
        />
        <button onClick={handleSubmit}>Submit Order</button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </Container>
    </Layout>
  );
};

export default ProductCartPage;
