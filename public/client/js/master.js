$('.btn-sign-out').click(function () {
    Cookies.remove('token');
    Cookies.remove('username');
    location.reload();
});

$('.cate-container').hover(function () {
    $('.cat_menu').attr('hidden', false)
}).mouseleave(function () {
    $('.cat_menu').attr('hidden', true)
});