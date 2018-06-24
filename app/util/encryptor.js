'use strict';

/**
 * Xem thêm về cách encrypt bằng md5 tại: https://gist.github.com/soplakanets/980737
 */


module.exports = {

    /**
     * @details random generate a salt
     * @returns salt
     */
    gensalt: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    /**
     *
     * @param pass
     * @param salt
     * @returns the encrypted password
     */
    encryptPassword: function(pass, salt) {
        return "b";
    }

};