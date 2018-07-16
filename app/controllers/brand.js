'use strict';

const model = require('../models/brand');

module.exports = {

    /**
     * Validate dữ liệu từ req.body
     * name, description, logo không null
     * Nếu không thỏa mãn, nhét lỗi vào res.locals.errs
     * Sau khi validate hoàn tất thì next()
     * @param req
     * @param res
     * @param next
     */
    validate: function(req, res, next){
        if(!res.locals.errs) res.locals.errs = {};
        if(!req.body.name || req.body.name === null || req.body.name === '') res.locals.errs.name = 'Brand name can not be null';
        if(!req.body.description || req.body.description === null || req.body.description === '') res.locals.errs.description = 'Brand description can not be null';
        if(!req.body.logo || req.body.logo === null || req.body.logo === '') res.locals.errs.logo = 'Brand logo can not be null';
        next();
    },

    /**
     * Thực hiện sau khi chạy hàm validate
     * Nếu có lỗi, và object res.locals.errs không empty thì next() luôn, sang hàm response view (hoặc có thể là response json)
     * Nếu không lỗi, thực hiện insert brand mới vào db
     * Nếu insert vào db có lỗi, log lỗi, nhét lỗi vào res.locals.errs và next()
     * Nếu thành công, setup res.locals (là option để hiển thị trang thông báo thành công), và next();
     * @param req
     * @param res
     * @param next
     */
    insertOne: function (req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();

        let brand = new model(req.body);
        brand.save(function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.name = "This brand name has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Add brand successfully',
                link: '/manager/products-manager/brands/create',
                result: result
            };
            next();
        })
    },

    /**
     * Lấy query từ params của url
     * Tìm brand với tên này, nếu lỗi, log lỗi và set res.locals.errs.database
     * Nếu tìm được brand, set res.locals.brand = result[0], nếu không thì thôi
     * next() để sang hàm response
     * @param req
     * @param res
     * @param next
     */
    getOne: function (req, res, next) {
        let name = '';
        if (req.params.name) name = req.params.name;
        if (req.query.brand) name = req.query.brand;
        if (name === '') return next();
        let query = [{
            $match: {
                status: 1,
                name: name
            }
        }];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            if (result.length !== 0) res.locals.brand = result[0];
            next();
        });
    },

    /**
     * Thông số mặc định: limit: 10, skip 0, page 1
     * Nếu có query gửi lên, thay thông số query theo đó
     * Sau khi tìm thành công, pug view sẽ có brands là list get được, cùng meta là thông số phân trang.
     * @param req
     * @param res
     * @param next
     */
    getList: function (req, res, next) {
        let limit = 10, skip = 0, page = 1;
        if (req.query.blimit && /^\d+$/.test(req.query.blimit)) limit = Math.abs(Number(req.query.blimit));
        if (req.query.bpage && !['-1', '1'].includes(req.query.bpage) && /^\d+$/.test(req.query.bpage)) {
            page = Math.abs(Number(req.query.bpage));
            skip = (page - 1) * limit;
        }
        /**
         * Sử dụng mongodb aggregate, $facet
         * Cấu trúc result trả về, bao gồm 2 trường meta và data, meta là thông số phân trang, data là dữ liệu lấy được
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/facet/
         */
        let query = [
            {
                $match: {
                    status: 1,
                }
            },
            {
                '$facet': {
                    meta: [{$count: "totalItems"}],
                    data: [{$skip: skip}, {$limit: limit}] // add projection here wish you re-shape the docs
            }
        }];

        /**
         * Nếu có tìm kiếm, tạo match và đẩy vào đầu array query
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/match/
         */
        if (req.query.bq) {
            let pattern = new RegExp(req.query.bq, 'i');
            query[0].$match.$or = [
                {description: pattern},
                {name: pattern}
            ];
        }

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt res.locals.brands = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.brands = [];
                return next();
            }
            res.locals.brands = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            res.locals.bmeta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.bq
            };
            next();
        });
    },

    getAll: function(req, res, next) {
        model.find({status: 1}, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            res.locals.brands = result;
            next();
        })
    },

    editOne: function(req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();

        let brand = req.body;
        brand.updated_at = Date.now();
        model.findOneAndUpdate({name: req.params.name}, {$set: brand}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.name = "This brand name has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Edit brand successfully',
                link: '/manager/products-manager/brands',
                result: result
            };
            next();
        });
    },

    deleteOne: function (req, res, next) {
        let query = {
            name: req.params.name
        };
        model.findOneAndUpdate(query, {$set: {status: -1, updated_at: Date.now()}}, {new: true}, function (err, result) {
            if(err){
                console.log(err);
                if (!res.locals.errs) req.res.locals = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            if(result === null) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs["404"] = 'Brand not found';
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Delete brand successfully',
                link: '/manager/products-manager/brands',
                result: result
            };
            next();
        });
    },

    /**
     * Trả về view brand form sau khi đã chạy qua các middleware
     * Nếu có lỗi, trả về form, kèm lỗi và dữ liệu đã nhập
     * Nếu đã success, gửi về trang success, kèm successResponse
     * @param req
     * @param res
     * @param next
     */
    responseInsertOneByBrandFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/products-manager/brands-form', {
                path: '/products-manager/add-brand',
                brand: req.body,
                title: 'ADD BRAND'
            });
        } else {
            res.render('index');
        }
    },

    responseBrandEditForm: (req, res) => {
        res.render('admin/pages/products-manager/brands-form', {
            path: '/products-manager/brands',
            method: 'PUT',
            title: 'EDIT BRAND'
        });
    },

    responseEditByBrandForm: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/products-manager/brands-form', {
                title: 'EDIT BRAND',
                brand: req.body,
                path: '/products-manager/brands',
                method: 'PUT'
            });
            return;
        }
        res.render('index');
    },

    responseJson: function (req, res) {
        if(res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json(res.locals.errs);
            return;
        }
        res.status(200);
        res.json(res.locals.result);
    },

    /**
     * Trả về bảng brand sau khi đã get list
     * @param req
     * @param res
     */
    responseBrandTable: (req, res) => res.render('admin/pages/products-manager/brands', {path: '/products-manager/brands'})
};