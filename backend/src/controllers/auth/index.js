//xu ly cac tac vu lien quan den dang ki, dang nhap, lam moi token, dang xuat, truy van thong tin nguoi dung
const {Boom} = require('boom');
const {User} = require('../../models/user');

//helpers
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require("../../helpers-jwt/jwt");

//validations
const {validationSchema} = require('./validation');
const {redis} = require('../../clients/redis');

const Register = async(req, res, next) => {
    const input = req.body;  //lay du lieu tu req.body
    
    const {error} = validationSchema.validate(input);

    if(error){
        return next(Boom.badRequest(error.details[0].message));
    }

    try{
        //kiem tra xem ton tai email chua
        const isExists = await User.findOne({email: input.email});

        if(isExists){
            return next(Boom.conflict("this email already using"));
        }

        //tao tai khoan moi va luu vao csdl
        const user = new User(input);
        const data = await user.save();
        const userData = data.toObject();

        delete userData.password;
        delete userData.__v;

        const accessToken = await signAccessToken({
            user_id: user._id,
            role: user.role,
        });

        const refreshToken = await signRefreshToken(user._id);

        res.json({
            user: userData,
            accessToken,
            refreshToken,
        });
    }catch(e){
        next(e);
    }
};

const Login = async (req, res, next) => {
    const input = req.body;

    const {error} = validationSchema.validate(input);

    if(error) {
        return next(Boom.badRequest(error.details[0].message));
    }

    try{
        const user = await User.findOne({email: input.email});

        if(!user){
            throw Boom.notFound("the email address was not found");
        }

        const isMatched = await user.isValidPass(input.password);
        if(!isMatched){
            throw Boom.unauthorized("email or password not correct");
        }

        const accessToken = await signAccessToken({
            user_id: user._id,
            role: user.role,
        });
        const refreshToken = await signRefreshToken(user._id);

        const userData =user.toObject();
        delete userData.password;
        delete userData.__v;

        res.json({user: userData, accessToken, refreshToken});
    }catch(e){
        return next(e);
    }
};

const RefreshToken = async (req, res, next) =>{
    const {refresh_token} = req.body; //lay du lieu tu 

    try{
        //neu khong ton tai thi tra ve loi
        if(!refresh_token) {
            throw Boom.badRequest();
        }

        //xac minh va lay du lieu user
        const user_id = await verifyRefreshToken(refresh_token);
        const accessToken = await signAccessToken(user_id); //tao token va tra ve refreshToken cua chung
        const refreshToken = await signRefreshToken(user_id);

        res.json({accessToken, refreshToken});
    }catch(err){
        next(e);
    }
};

const Logout = async (req, res, next) => {
    try{
        const {refresh_token} = req.body;
        if(!refresh_token){
            throw Boom.badRequest();
        }

        const user_id = await verifyRefreshToken(refresh_token);
        const data = await redis.del(user_id);

        if(!data){
            throw Boom.badRequest();
        }

        res.json({message:"success"});
    }catch(e){
        console.log(e);
        return next(e);
    }
};

const Me = async (req, res, next) => {
    const {user_id} = req.payload;

    try{
        const user = await User.findById(user_id).select("-password -__v");

        res.json(user);
    }catch(e){
        next(e);
    }
};

module.exports = {Register, Login, RefreshToken, Logout, Me };