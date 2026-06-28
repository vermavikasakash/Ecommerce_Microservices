const express = require("express");
const { asyncHandler } = require("../../shared/utils/asyncHandler");
const { DummyPaymentProvider } = require("../providers/DummyPaymentProvider");
const { PaymentService } = require("../services/PaymentService");
const { publishRealtimeEvent } = require("../../shared/utils/realtimePublisher");
const Razorpay = require('razorpay');

const paymentService = new PaymentService(new DummyPaymentProvider());

const paymentRouter = express.Router();

paymentRouter.post("/charge", asyncHandler(async (req, res) => {
  const { amount, customer, method } = req.body;

  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const razor = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razor.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `receipt_${Date.now()}` });
    return res.status(201).send({ success: true, order });
  }

  const payment = await paymentService.collectPayment({ amount, customer, method });

  const payload = { customerId: customer.customerId, orderId: null, payment };
  publishRealtimeEvent('payment.completed', payload);

  res.status(200).send({ success: true, message: 'Payment processed successfully', payment });
}));

paymentRouter.get("/provider", (req, res) => {
  res.status(200).send({ success: true, provider: process.env.RAZORPAY_KEY_ID ? 'razorpay' : 'dummy', message: process.env.RAZORPAY_KEY_ID ? 'Razorpay enabled' : 'Dummy provider active' });
});

paymentRouter.post('/razorpay/verify', (req, res) => {
  const crypto = require('crypto');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
  }

  const payload = { customerId: req.header('x-customer-id') || 'guest-customer', orderId: razorpay_order_id, payment: { id: razorpay_payment_id } };
  publishRealtimeEvent('payment.completed', payload);

  res.json({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
});

module.exports = { paymentRouter, paymentService };
