const Cart = require("../models/Cart");
const Product = require("../models/Product");

function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
    res.json(cart);
  } catch (e) {
    next(e);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const p = await Product.findById(productId);
    if (!p) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });

    const idx = cart.items.findIndex((it) => it.product.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: p._id, quantity, price: p.price });

    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex((it) => it.product.toString() === productId);
    if (idx < 0) return res.status(404).json({ message: "Item not in cart" });

    cart.items[idx].quantity = quantity;
    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((it) => it.product.toString() !== productId);
    cart.totalPrice = calcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

exports.clear = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json(cart);
  } catch (e) {
    next(e);
  }
};
