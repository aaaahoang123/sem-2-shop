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
var categories = '';

$('.custom_list.clc > li > a').click(function () {
    categories = $(this).attr('data-c');
});

$('#btn-search').click(function () {
    var forms = document.forms['form-search'];
    var q = forms['input-search'].value;
   location.href = '/shop?q=' + q + '&category=' + categories.replace("&","%26");
});

