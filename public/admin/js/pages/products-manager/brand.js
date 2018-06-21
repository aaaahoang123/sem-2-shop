$(function () {
    $('.js-sweetalert button').on('click', function () {
        var name = $(this).attr('data-b');
        var type = $(this).data('type');
        if (type === 'ajax-loader') {
            showAjaxLoaderMessage(name);
        }
    });
});

function showAjaxLoaderMessage(name) {
    swal({
        title: "Do you want to delete brand: " + name,
        text: "Submit to run ajax request",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        $.ajax({
            url: '/manager/dashboard/products-manager/brands/' + name,
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
                    swal("Fail to delete. Please check log");
                }, 1000);
            }
        })


    });
}

$('#search-btn').click(function () {
    changeSearchByInput('#search-input', 'q=');
});

$('#search-input').keyup(function (ev) {
    if(ev.keyCode === 13 || ev.which === 13) {
        changeSearchByInput(this, 'q=');
    }
});

$('#select-limit').change(function () {
    changeSearchByInput(this, 'limit=')
});

function changeSearchByInput(el, except) {
    var searchArray = location.search.split('&');
    var href = '?';
    for (var i = 0; i < searchArray.length; i++) {
        if (!searchArray[i].includes('page=') && !searchArray[i].includes(except)) {
            href += searchArray[i].replace("?", "") + '&';
        }
    }
    href += except + $(el).val();
    location.search = href;
}

function deleteBtn(name) {
    alert(name);
}