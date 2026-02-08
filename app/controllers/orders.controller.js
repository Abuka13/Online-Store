const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { sendOrderConfirmationEmail } = require("../services/email.service");

exports.create = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const items = cart.items.map((it) => ({
      product: it.product?._id,
      name: it.product?.name || "Product",
      price: it.price,
      quantity: it.quantity
    }));

    const totalPrice = cart.totalPrice;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      shippingAddress: req.body.shippingAddress || {},
      paymentMethod: req.body.paymentMethod || "cash"
    });

    // clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // email confirm (safe)
    const u = await User.findById(req.user.id);
    if (u) {
      sendOrderConfirmationEmail({
        to: u.email,
        name: u.name,
        orderId: order._id,
        total: String(order.totalPrice)
      }).catch(() => {});
    }

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email role");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // user can see own order, admin/moderator can see all
    if (order.user?._id?.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
};

exports.markPaid = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user.id && !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Cancelled", order });
  } catch (e) {
    next(e);
  }
};
