'use strict';

const model = require('../models/product');

module.exports = {
    checkNull: function (req,res,next) {
        var data = req.body;
        console.log(req.body);
        console.log(data.specifications);
        if (!data.name || !data.description || !data.categories || !data.brand || !data.price || !data.specifications) {
            res.status(403);
            res.send({
                'status': '403',
                'message': 'Product name, description, categories, brand, price can\'t be null or undefined'
            });
            return;
        }
        next();
    },
    insertOne: function (req, res, next) {
        var newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if(err){
                res.status(400);
                res.send({
                    code : 400,
                    title: 'Server Error',
                    detail: 'Server Error'
                });
                console.log(err);
                return;
            }
            res.status(201);
            res.send(result);
        })
    }

};

// module.exports = {
//     getOne: function (req, res, next) {
//         let query = {
//             code: req.params.code
//         };
//         model.find(query, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.send(err);
//                 return;
//             }
//             req.products = [
//                 result
//             ];
//         });
//         next();
//     }
// };

