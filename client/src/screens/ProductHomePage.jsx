import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { toast } from "react-toastify";
import { getProductsFunction } from "../serviceApi/servicesApi";
import { Container, Button } from "react-bootstrap";

import { useGlobalData } from "../context/contextApiProvider";

const ProductHomePage = () => {
  const [loader, setLoader] = useState(null);
  const [products, setProducts] = useState([]);

  const [globalData, setGlobalData, addToCart] = useGlobalData();

  //? Fetching the Products from backend
  const GetProductsFunction = async () => {
    setLoader(true);
    const result = await getProductsFunction();
    if (result.status === 200) {
      setProducts(result.data.products);
    }
    setLoader(false);
  };

  useEffect(() => {
    GetProductsFunction();
  }, []);

  // ! JSX START

  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginTop: "10px" }}>Product</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        {products?.map((data) => (
          <div
            key={data.id}
            style={{
              marginBottom: "1rem",
              paddingTop: "5px",
              borderRadius: "10px",
              border: "1px solid",
              width: "350px",
              height: "450px",
              textAlign: "center",
            }}
          >
            <img
              src={data.image}
              alt={data.name}
              style={{ width: "200px", height: "250px" }}
            />
            <h3>{data.name}</h3>
            <p>{data.description}</p>
            <p>&#8377;{data.price}</p>
            <Button
              onClick={() => {
                addToCart(data);
                toast.success("Item added to cart");
              }}
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ProductHomePage;
