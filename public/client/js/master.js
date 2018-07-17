(function () {
    $('.btn-sign-out').click(function () {
        Cookies.remove('token');
        Cookies.remove('username');
        location.href = '/';
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

    $('#btn-search').click(globalDoSearch);

    $('form[name="form-search"] input[name="input-search"]').keyup(function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            globalDoSearch();
        }
    });

    function globalDoSearch() {
        var newHref = '/shop?q=' + $('form[name="form-search"] input[name="input-search"]').val();
        if (categories !== '') newHref += '&category=' + categories;
        location.href = newHref;
    }
})();

