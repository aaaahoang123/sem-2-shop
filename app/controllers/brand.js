'use strict';

const model = require('../models/brand');

module.exports = {

    /**
     * Validate dữ liệu từ req.body
     * name, description, logo không null
     * Nếu không thỏa mãn, nhét lỗi vào req.errs
     * Sau khi validate hoàn tất thì next()
     * @param req
     * @param res
     * @param next
     */
    validate: function(req, res, next){
        if(!req.errs) req.errs = {};

        if(!req.body.name || req.body.name === null || req.body.name === '') req.errs.name = 'Brand name can not be null';

        if(!req.body.description || req.body.description === null || req.body.description === '') req.errs.description = 'Brand description can not be null';

        if(!req.body.logo || req.body.logo === null || req.body.logo === '') req.errs.logo = 'Brand logo can not be null';

        next();
    },

    /**
     * Thực hiện sau khi chạy hàm validate
     * Nếu có lỗi, và object req.errs không empty thì next() luôn, sang hàm response view (hoặc có thể là response json)
     * Nếu không lỗi, thực hiện insert brand mới vào db
     * Nếu insert vào db có lỗi, log lỗi, nhét lỗi vào req.errs và next()
     * Nếu thành công, setup req.successResponse (là option để hiển thị trang thông báo thành công), và next();
     * @param req
     * @param res
     * @param next
     */
    insertOne: function (req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }

        let brand = new model(req.body);
        brand.save(function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                if (err.code === 11000) req.errs.name = "This brand name has already existed";
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Add brand successfully',
                link: '/manager/dashboard/products-manager/brands/create',
                result: result
            };
            next();
        })
    },

    getOne: function (req, res, next) {
        let query = {
            name: req.params.name
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.brands = result;
            next();
        });
    },

    getList: function (req, res, next) {
        let limit = 10, skip = 0, page = 1;
        if (req.query.limit && /^\d+$/.test(req.query.limit)) limit = Math.abs(Number(req.query.limit));
        if (req.query.page && !['-1', '1'].includes(req.query.page) && /^\d+$/.test(req.query.page)) {
            page = Math.abs(Number(req.query.page));
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
        if (req.query.q) {
            let pattern = new RegExp(req.query.q, 'i');
            query[0].$match.$or = [
                {description: pattern},
                {name: pattern}
            ];
        }

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                req.brands = [];
                next();
                return;
            }
            req.brands = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            req.meta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.q
            };
            next();
        });
    },

    editOne: function(req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }

        let brand = req.body;
        brand.updated_at = Date.now();
        model.findOneAndUpdate({name: req.params.name}, {$set: brand}, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                if (err.code === 11000) req.errs.name = "This brand name has already existed";
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Edit brand successfully',
                link: '/manager/dashboard/products-manager/brands',
                added: result
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
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if(result === null) {
                if (!req.errs) req.errs = {};
                req.errs["404"] = 'Brand not found';
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Add brand successfully',
                link: '/manager/dashboard/products-manager/brands',
                result: result
            };
            next();
        });
    },

    /**
     * Trả về view brand form sau khi đã chạy qua các middleware
     * Nếu không có lỗi, và không có successResponse, thì trả về brand-form trắng (chạy ghi vào brand-form lần đầu)
     * Nếu có lỗi, trả về form, kèm lỗi và dữ liệu đã nhập
     * Nếu đã success, gửi về trang success, kèm successResponse
     * @param req
     * @param res
     * @param next
     */
    responseBrandFormView: function(req, res, next) {
        if ((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)) {
            res.render('admin/pages/products-manager/brands-form', {path: '/products-manager/add-brand', title: 'ADD BRAND'});
        } else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/products-manager/brands-form', {
                path: '/products-manager/add-brand',
                errs: req.errs,
                brand: req.body,
                title: 'ADD BRAND'
            });
        } else {
            res.render('index', req.successResponse);
        }
    },

    responseBrandEditFormView: function(req, res, next) {
        if (!res.locals) res.locals = {};
        res.locals.method = 'PUT';
        res.locals.title = 'EDIT BRAND';
        res.locals.path = '/products-manager/brands';
        res.locals.action = '/manager/dashboard/products-manager/brands/' + req.params.name + '?_method=PUT';
        if (req.brands && req.brands.length !== 0) {
            res.render('admin/pages/products-manager/brands-form', {
                brand: req.brands[0]
            });
        }
        else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/products-manager/brands-form', {
                errs: req.errs,
                brand: req.body,
            });
        }
        else if (req.successResponse && Object.keys(req.successResponse).length !== 0) {
            res.render('index', req.successResponse);
        }
        else {
            res.render('admin/pages/products-manager/brands-form', {
                brand: undefined,
                link: '/manager/dashboard/products-manager/brands',
            });
        }
    },

    responseJson: function (req, res, next) {
        if(req.errs && Object.keys(req.errs).length !== 0) {
            res.status(404);
            res.json(req.errs);
            return;
        }
        res.status(200);
        res.json(req.successResponse.result);
    },

    /**
     * Trả về bảng các brands
     * Nếu không có brand, trả về thông báo 404
     * Nếu có brand mà không có meta, trả về bảng không có phân trang
     * Trường hợp còn lại, trả về có meta và phân trang đầy đủ
     * @param req
     * @param res
     * @param next
     */
    responseBrandView: function (req, res, next) {
        let length = req.brands.length;
        res.locals.path = '/products-manager/brands';
        if (length === 0 || req.brands.status === -1) {
            res.render('admin/pages/products-manager/brands', {
                type: 0,
            });
        }
        else if (!req.meta) {
            res.render('admin/pages/products-manager/brands', {
                type: 1,
                brands: req.brands,
            });
        }
        else {
            res.render('admin/pages/products-manager/brands', {
                type: 2,
                brands: req.brands,
                meta: req.meta
            });
        }
    }
};