//kiểm tra quyền truy cập của người dùng dựa vào vai trò(role) của họ
const {roles} = require("../clients/roles");

//import thu vien de xu li loi HTTP
const {Boom} = require('boom');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try{
            //kiem tra quyen truy cap dua tren vai tro cua nguoi dung
        const permission = roles.can(req.payload.role)[action](resource);

        if(!permission.granted){
            return next(Boom.unauthorized("you don't have permission"));
        }

        next();
        }catch(error){
            next(error);
        }
    };
};

module.exports = {grantAccess};