//phan quyen
const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("user").readAny("product"); //user co the doc bat ki san pham nao
    ac.grant("admin").extend("user").createAny("product"); //admin co the tao bat ki san pham nao

    return ac;
})(); 