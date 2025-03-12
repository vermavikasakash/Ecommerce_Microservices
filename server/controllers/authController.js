//! ---------------------------------------------------------------------------->
//? dummy data
const products = [
  {
    id: 1,
    name: "Watch",
    description: "Wow it's a nice smart watch",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "TV",
    description: "Wow it's a nice smart television",
    price: 15999,
    image:
      "https://media.istockphoto.com/id/1395191574/photo/black-led-tv-television-screen-blank-isolated.jpg?s=612x612&w=0&k=20&c=ps14JZJh0ebkINcbQyHFsR1J5EC7ozkj_WO7Fh_9IOI=",
  },
  {
    id: 3,
    name: "Phone",
    description: "Wow it's a nice smart smartphone",
    price: 15999,
    image:
      "https://img.freepik.com/free-photo/creative-reels-composition_23-2149711471.jpg?semt=ais_hybrid",
  },
  {
    id: 4,
    name: "Book",
    description: "Wow it's a nice text book",
    price: 499,
    image: "https://pngimg.com/uploads/book/book_PNG2111.png",
  },
  {
    id: 5,
    name: "Headphone",
    description: "Wow it's a nice smart Headphone",
    price: 2999,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSJGa1MYIeatMnC6udWO_9gKgp_70cEaR0nojoLC3VUBGiP_uX_vfZJUShdw6oTKzZqj5sGOFRQel1jzLmUxNhGA-CoZgm9r7Va5RA-bJFA_TBZnUmov7Mceg",
  },
];

//? GET PRODUCTS

const getProductController = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't fetch product",
      error,
    });
  }
};

//? POST PRODUCTS
const postProductController = async (req, res) => {
  try {
    const { firstName, lastName, address, cart } = req.body;

    //! validations
    if (!firstName) {
      return res
        .status(400)
        .send({ success: true, error: "First name is required" });
    }
    if (!lastName) {
      return res
        .status(400)
        .send({ success: true, error: "Last name is required" });
    }

    if (!address) {
      return res
        .status(400)
        .send({ success: true, error: "address is required" });
    }
    if (!cart.length) {
      return res
        .status(400)
        .send({ success: true, error: "Atleast one product is required" });
    }
    console.log("Product details", req.body);

    res
      .status(200)
      .send({ success: true, message: "Product ordered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in processing the order",
      error,
    });
  }
};

// ! EXPORTS
module.exports = {
  getProductController,
  postProductController,
};
