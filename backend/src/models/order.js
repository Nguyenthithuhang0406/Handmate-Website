const { Schema, default: mongoose } = require("mongoose");

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  address: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("order", OrderSchema);

module.exports = { Order };
