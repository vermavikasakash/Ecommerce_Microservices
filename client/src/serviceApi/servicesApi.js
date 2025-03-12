import axios from "axios";

//? CREATE ORDER API

const createOrderFunction = async (payload) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API}/api/postOrders`,
      payload
    );
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? GET PRODUCTS API
const getProductsFunction = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/api/getProducts`);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { createOrderFunction, getProductsFunction };
