const { User } = require('../../models/user');
const { Order } = require('../../models/order');
const { Boom } = require('boom');
const { OrderSchema } = require('./validation');

//tao don hang
const Create = async (req, res, next) => {
  const input = req.body;
  input.items = input.items ? JSON.parse(input.items) : null;
  const { error } = OrderSchema.validate(input); //validate du lieu dau vao su dung joi

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;

  try {
    //tao doi tuong Order moi tu model Order
    const order = new Order({
      user: user_id,
      address: input.address,
      items: input.items,
    });

    //luu don hang vao co so du lieu
    const saveData = await order.save();

    //tra ve du lieu don hang da luu
    res.json(saveData);
  } catch (e) {
    next(e);
  }
};

//danh sach don hang
const List = async (req, res, next) => {
  try {
    //lay danh sach don hang tu co so du lieu, va populate thong tin cua user va items
    const orders = await Order.find({})
      .populate("user", "-password -__v")
      .populate("items");

    //tra ve danh sach don hang
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

//lay don hang cua nguoi dung
const GetMyOrders = async (req, res, next) => {
  const { user_id } = req.payload;

  try {
    //lay danh sach don hang cua nguoi dung dua vao user_id va populate thong tin cua purchases.item
    const orders = await Order.find({user: user_id}).populate("items");

    //tra ve danh sach don hang cua nguoi dung
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

module.exports = { Create, List, GetMyOrders };
