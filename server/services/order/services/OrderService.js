const { env } = require("../../shared/config/env");
const { makeServiceRequest } = require("../../shared/utils/makeServiceRequest");
const { publishRealtimeEvent } = require("../../shared/utils/realtimePublisher");

class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async listOrders(customerId) {
    return this.orderRepository.findByCustomerId(customerId);
  }

  async createOrder(customerId, checkout) {
    this.validateCheckout(checkout);

    // Get cart from cart service
    const cartData = await makeServiceRequest(
      env.serviceUrls.cart,
      "GET",
      `/api/cart`,
      null,
      customerId
    );

    const cart = cartData.cart;
    if (!cart.items.length) {
      const error = new Error("At least one product is required");
      error.statusCode = 400;
      throw error;
    }

    // Create payment through payment service
    const paymentData = await makeServiceRequest(
      env.serviceUrls.payments,
      "POST",
      `/api/payments/charge`,
      {
        amount: cart.total,
        method: checkout.paymentMethod,
        customer: {
          customerId,
          firstName: checkout.firstName,
          lastName: checkout.lastName,
        },
      },
      customerId
    );

    const orderId = `ord_${Date.now()}`;
    const order = await this.orderRepository.create({
      id: orderId,
      customerId,
      customer: {
        firstName: checkout.firstName,
        lastName: checkout.lastName,
        address: checkout.address,
      },
      items: cart.items,
      total: cart.total,
      payment: paymentData.payment,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    // Clear cart through cart service
    await makeServiceRequest(
      env.serviceUrls.cart,
      "DELETE",
      `/api/cart`,
      null,
      customerId
    );

    await publishRealtimeEvent("order.created", {
      customerId,
      order,
    });

    return order;
  }

  validateCheckout(checkout) {
    const requiredFields = ["firstName", "lastName", "address"];
    const missingField = requiredFields.find((field) => !checkout[field]);

    if (missingField) {
      const error = new Error(`${missingField} is required`);
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = { OrderService };
