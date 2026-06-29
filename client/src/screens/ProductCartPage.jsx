import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout/Layout";
import { useGlobalData } from "../context/contextApiProvider";

const ProductCartPage = () => {
  const navigate = useNavigate();
  const { cart, orders, updateCartItem, removeCartItem, placeOrder, realtimeStatus, isAuthenticated } =
    useGlobalData();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    paymentMethod: "dummy-card",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true, state: { from: "/cart" } });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    if (!cart.items.length) return "At least one product is required";
    if (!formData.firstName) return "First name is required";
    if (!formData.lastName) return "Last name is required";
    if (!formData.address) return "Address is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    try {
      setIsSubmitting(true);
      const order = await placeOrder(formData);
      toast.success(`Order ${order.id} confirmed`);
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        paymentMethod: "dummy-card",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="page-shell cart-layout">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Realtime cart</p>
            <h1>Checkout</h1>
          </div>
          <span className={`status-pill ${realtimeStatus}`}>{realtimeStatus}</span>
        </div>

        <div className="checkout-grid">
          <div className="cart-panel">
            <h2>Cart Items</h2>
            {!cart.items.length ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              <div className="cart-list">
                {cart.items.map((item) => (
                  <div className="cart-row" key={item.productId}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>&#8377;{item.price} each</p>
                    </div>
                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                        title="Decrease quantity"
                      >
                        <FiMinus aria-hidden="true" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        <FiPlus aria-hidden="true" />
                      </button>
                    </div>
                    <strong>&#8377;{item.lineTotal}</strong>
                    <button
                      type="button"
                      className="icon-danger"
                      onClick={() => removeCartItem(item.productId)}
                      title="Remove item"
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="cart-total">
              <span>Total</span>
              <strong>&#8377;{cart.total}</strong>
            </div>
          </div>

          <Form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Order Details</h2>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="dummy-card">Dummy card success</option>
                <option value="dummy-upi">Dummy UPI success</option>
                <option value="fail">Dummy failure test</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" disabled={isSubmitting || !cart.items.length}>
              {isSubmitting ? "Placing order..." : "Place Order"}
            </Button>
            {error && <p className="form-error">{error}</p>}
          </Form>
        </div>

        <div className="orders-panel">
          <h2>Recent Orders</h2>
          {!orders.length ? (
            <p className="muted">No orders placed yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-row" key={order.id}>
                  <div>
                    <h3>{order.id}</h3>
                    <p>{order.status} via {order.payment.provider}</p>
                  </div>
                  <strong>&#8377;{order.total}</strong>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductCartPage;
