const { Schema, default: mongoose } = require('mongoose');
const  bcrypt  = require('bcrypt');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true, //bat buoc phai co du lieu
    unique: true, //phai la duy nhat
    lowercase: true, //phai la chu thuong
  },
  password: {
    type: String,
    required: true,
    select: false, // khong dua thuoc tinh password khi chuyen doi json, tranh lo password, => an password
  },
  role: {
    type: String,
    default: "user", //mac dinh la user neu khong co chi dinh nao khac
    enum: ["user", "admin"], //vai tro
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      //neu doi tuong moi thi thuc hien hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(this.password, salt);
      this.password = hashed;
    }

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPass = async function (pass) {
  return await bcrypt.compare(pass, this.password); //so sanh password cung cap voi pass da hash
};

const User = mongoose.model("user", UserSchema);
module.exports = { User };
