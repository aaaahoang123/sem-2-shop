$.cookie('dkm', 'abc');

$.ajax({
    url: '/users',
    method: 'post',
    success: function (res) {
        console.log($.cookie());
    },
    error: function (res) {
        console.log(res);
    }
});