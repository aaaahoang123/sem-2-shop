'use strict';

const web_config = require('../resource/web-config');
const model = require('../models/category');
const mongoose = require('mongoose');

module.exports = {
    getTopCategories: (req, res, next) => {
        let top_categories = [];
        // console.log(web_config.top_categories);
        web_config.top_categories.forEach(c => {
            top_categories.push(mongoose.Types.ObjectId(c));
        });
        let pipeline =
            [
                {
                    "$match" : {
                        "_id" : {
                            "$in" : top_categories
                        }
                    }
                },
                {
                    "$lookup" : {
                        "from" : "products",
                        "localField" : "_id",
                        "foreignField" : "categories",
                        "as" : "products"
                    }
                },
                {
                    "$unwind" : {
                        "path" : "$products",
                        "preserveNullAndEmptyArrays" : true
                    }
                },
                {
                    "$sort" : {
                        "products.created_at" : -1
                    }
                },
                {
                    "$group" : {
                        "_id" : "$_id",
                        "name" : {
                            "$first" : "$name"
                        },
                        "products" : {
                            "$push" : "$products"
                        }
                    }
                },
                {
                    "$project" : {
                        "_id" : true,
                        "name" : true,
                        "products" : {
                            "$slice" : [
                                "$products",
                                10
                            ]
                        }
                    }
                }
            ];
        model.aggregate(pipeline, (err, result) => {
            if (err) {
                console.log(err);
                next();
            }
            console.log(result);
            res.locals.top_categories = result;
            next();
        });
    },
};