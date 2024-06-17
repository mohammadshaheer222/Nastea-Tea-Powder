const catchAsyncErrors = require("../Middlewares/catchAsynErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const Cart = require("../Model/cartModel");
const Product = require("../Model/productModel");

const addToCart = catchAsyncErrors(async (req, res, next) => {
  try {
    const { product: productId } = req.body;

    // Check if the product exists
    const cartProduct = await Product.findById(productId);
    // console.log(cartProduct)
    if (!cartProduct) {
      return next(
        new ErrorHandler(`Product not found with id ${productId}`, 404)
      );
    }

    // Check if the product is out of stock
    if (cartProduct.stock === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product is out of stock" });
    }

    // Check if the cart item already exists for the user and product
    let cartItem = await Cart.findOne({
      product: productId,
      user: req.user._id,
    }).populate("product");

    if (cartItem) {
      // If cart item exists, check if adding another unit exceeds stock
      if (cartItem.quantity >= cartProduct.stock) {
        return res.status(400).json({
          success: false,
          message: "Product stock limit reached in cart",
        });
      }

      cartItem.quantity += 1;
      await cartItem.save();

      return res
        .status(200)
        .json({ success: true, message: "Added to cart", cartItem });
    } else {
      // If cart item does not exist, create a new one
      cartItem = new Cart({
        quantity: 1,
        product: productId,
        user: req.user._id,
      });
      await cartItem.save();

      return res
        .status(200)
        .json({ success: true, message: "Added to cart", cartItem });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getCart = catchAsyncErrors(async (req, res, next) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("product");

    const sumOfQuantities = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    let subTotal = 0;

    cart.forEach((i) => {
      const itemSubTotal = i.product.price * i.quantity;
      subTotal += itemSubTotal;
    });


    res.status(200).json({ success: true, cart, subTotal, sumOfQuantities });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const removeFromCart = catchAsyncErrors(async(req, res, next) => {
  try{
    const cart = await Cart.findById(req.params.id);

    await cart.deleteOne();

    res.status(200).json({success: true, message: "Removed from cart"})

  } catch(error) {
    return next(new ErrorHandler(error.message, 500))
  }
})

module.exports = { addToCart, getCart, removeFromCart };
