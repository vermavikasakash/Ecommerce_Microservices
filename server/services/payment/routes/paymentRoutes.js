const express = require("express");
const { asyncHandler } = require("../../shared/utils/asyncHandler");
const {
  publishRealtimeEvent,
} = require("../../shared/utils/realtimePublisher");

const Razorpay = require("razorpay");

const paymentRouter = express.Router();

const isRazorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const getRazorpayClient = () => {
  if (!isRazorpayConfigured()) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

paymentRouter.get("/provider", (req, res) => {
  res
    .status(200)
    .send({
      success: true,
      provider: "razorpay",
      configured: isRazorpayConfigured(),
      message: process.env.RAZORPAY_KEY_ID
        ? "Razorpay enabled"
        : "Razorpay key id is not configured",
      keyId: process.env.RAZORPAY_KEY_ID || null,
    });
});

paymentRouter.get("/razorpay/key", (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).send({
      success: false,
      message: "Razorpay key id is not configured",
    });
  }

  return res.status(200).send({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

paymentRouter.post(
  "/razorpay/order",
  asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).send({
        success: false,
        message: "Amount must be at least INR 1",
      });
    }

    const razor = getRazorpayClient();
    const order = await razor.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(201).send({ success: true, order });
  })
);

paymentRouter.post("/razorpay/verify", asyncHandler(async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res
      .status(400)
      .json({ error: "Missing payment verification fields" });
  }

  const razor = getRazorpayClient();
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ verified: false, error: "Invalid payment signature" });
  }

  if (amount) {
    const razorpayOrder = await razor.orders.fetch(razorpay_order_id);
    const expectedAmount = Math.round(Number(amount) * 100);

    if (razorpayOrder.amount !== expectedAmount) {
      return res.status(400).json({
        verified: false,
        error: "Payment amount does not match the order total",
      });
    }
  }

  const payload = {
    customerId: req.header("x-customer-id") || "guest-customer",
    orderId: razorpay_order_id,
    payment: {
      provider: "razorpay",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: "captured",
      amount: amount ? Number(amount) : undefined,
      method: "razorpay",
    },
  };
  publishRealtimeEvent("payment.completed", payload);

  res.json({
    success: true,
    verified: true,
    payment: payload.payment,
  });
}));

module.exports = { paymentRouter };
