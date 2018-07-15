$(function () {
    $('button.btn.btn-link.waves-effect[data-type="ajax-loader"]').on('click', showAjaxLoaderMessage);
});

function showAjaxLoaderMessage() {
    var name = $(this).data('b');
    swal({
        title: "Do you want to delete category: " + name,
        text: "Submit to delete this brand",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        $.ajax({
            url: '/manager/products-manager/categories/' + name,
            type: 'DELETE',
            success: function (res) {
                console.log(res);
                setTimeout(function () {
                    swal({title: "Delete successfully!"}, function () {
                        location.reload();
                    });
                }, 1000);
            },
            error: function (res) {
                console.log(res);
                setTimeout(function () {
                    swal("Fail to delete. Please check log!");
                }, 1000);
            }
        })
    });
}

$('#search-btn').click(function () {
    changeSearchByInput('#search-input', 'cq=');
});

$('#search-input').keyup(function (ev) {
    if(ev.keyCode === 13 || ev.which === 13) {
        changeSearchByInput(this, 'cq=');
    }
});

$('.select-limit').change(function () {
    changeSearchByInput(this, 'climit=')
});

$('.select-level').change(function () {
    changeSearchByInput(this, 'clevel=')
});

function changeSearchByInput(el, except) {
    var searchArray = location.search.split('&');
    var href = '?';
    for (var i = 0; i < searchArray.length; i++) {
        if (!searchArray[i].includes('cpage=') && !searchArray[i].includes(except) && searchArray[i] !== '') {
            href += searchArray[i].replace("?", "") + '&';
        }
    }
    href += except + $(el).val();
    location.search = href;
}