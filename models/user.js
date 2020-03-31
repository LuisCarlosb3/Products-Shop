const mongoose = require("mongoose");
const Order = require("./order");
const Schema = mongoose.Schema;
const user = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

user.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(prod => {
    return prod.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  this.cart = {
    items: updatedCartItems
  };
  return this.save();
};
user.methods.deleteItemFromCart = function(productId) {
  const updateCartItems = this.cart.items.filter(item => {
    return item._id.toString() !== productId.toString();
  });
  this.cart.items = updateCartItems;
  return this.save();
};
user.methods.clearCart = async function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", user);
