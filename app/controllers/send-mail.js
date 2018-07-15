'use strict';
const nodemailer = require('nodemailer');
const rs = require('../resource/web-config');

module.exports = {

    validate: (req, res, next) => {
        if (!res.locals.errs) res.locals.errs = {};
        if (!req.body.name || req.body.name === null || req.body.name === '') res.locals.errs.name = 'Your name can not be null';
        if (!req.body.email || req.body.email === null || req.body.email === '') res.locals.errs.email = 'Your email can not be null';
        if (!req.body.message || req.body.message === null || req.body.message === '') res.locals.errs.message = 'Your message can not be null';
        next();
    },

    sendMail: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sem2shop@gmail.com',
                pass: 'sem2shop2018'
            }
        });

        var mailOptions = {
            from: 'sem2shop@gmail.com',
            to: rs.contact.email,
            subject: 'GET IN TOUCH',
            html: `
                <div><h2>- User email: ${req.body.email}</h2></div>
                <div><h2>- User Name: ${req.body.name}</h2></div>
                <div><h2>- User Name: ${req.body.phone}</h2></div>
                <div><h2>- Message:</h2></div>
                <div><textarea rows="8" cols="100">${req.body.message}</textarea></div>
            `
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.send = 'Send mail Fail, Please try again later';
                return next();
            } else {
                res.locals = {
                    title: 'Success',
                    detail: 'Send Message Successfully',
                    link: '/contact'
                };
                console.log('Email sent: ' + info.response);
                next();
            }
        });

    },

    responseContactFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('client/pages/contact', {contact: req.body});
        } else {
            res.render('index');
        }
    }
};