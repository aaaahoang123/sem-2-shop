'use strict';

const UserFormRenderer = (config, req) => {
    if (!req) req = {};
    this.config = {
        user_form: {
            display: false,
            action: '/manager/users-manager/users/create',
            user: req.user?req.user:false,
            errs: req.errs?req.errs:false,
            user_required: false
        },
        user_table: {
            display: false,
            user: false,
            user_required: true
        },
        account_form: {
            display: false,
            action: false,
            account: req.account?req.account:false,
            errs: req.errs?req.errs:false,
            account_required: false
        }
    };
    Object.assign(this.config.user_form, config.user_form?config.user_form:{});
    Object.assign(this.config.user_table, config.user_table?config.user_table:{});
    Object.assign(this.config.account_form, config.account_form?config.account_form:{});
};

UserFormRenderer.prototype = {
    render: (req, res) => {
        res.render('admin/pages/users-manager/index', this.config);
    }
};

module.exports = UserFormRenderer;