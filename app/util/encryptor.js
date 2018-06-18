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
        return "a";
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