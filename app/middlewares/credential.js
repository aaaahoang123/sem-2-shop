'use strict';

module.exports = {

    /**
     * @function Tạo ra credential, lưu vào collection credentials, set req.credential = result và next
     * @param req
     * @param res
     * @param next
     */
    create: function (req, res, next) {
        next();
    },

    /**
     * @function check token có tồn tại trong collection credentials không, nếu có, set req.credential = result và next.
     * Nếu sai, set req.errors.credential = ["Sai token..."] và next
     * @param req
     * @param res
     * @param next
     */
    check: function (req, res, next) {
        next();
    },

    /**
     * @function check xem req.credential có phải kiểu Admin không (type === 1), nếu có thì next
     * nếu không set req.errors.credential = ["Tài khoản không phải admin, mời kiểm tra và đăng nhập lại,..."]
     * @param req
     * @param res
     * @param next
     */
    checkAdmin: function (req, res, next) {
        next();
    }
};