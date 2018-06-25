$(function () {

    // sweetalert
    $('.js-sweetalert button').on('click', function () {
        var type = $(this).data('type');
        if (type === 'ajax-loader') {
            showAjaxLoaderMessage();
        }
    });

    // modal
    $('.js-modal-buttons .btn.btn-detail').on('click', function () {
        let products = JSON.parse($(this).attr('data-p'));
        // console.log($('#specificationsbody').html() === "");
        console.log(products.hasOwnProperty('specifications'));
        var tableRows = $('#detail-modal > tr');
        $(tableRows[0]).find('td').last().text(products.code);
        $(tableRows[1]).find('td').last().find('div').css('background-image', 'url(' + products.images + ')');
        $(tableRows[2]).find('td').last().text(products.name);
        $(tableRows[3]).find('td').last().html(products.description);
        $(tableRows[4]).find('td').last().text(products.categories);
        $(tableRows[5]).find('td').last().text(products.brand);
        $(tableRows[6]).find('td').last().text(products.price + "$");

        if (products.hasOwnProperty('specifications') === true) {
            $('#specificationsbody').html('');
            let i = 1;
            for (let specification in products.specifications) {
                $('#specificationsbody').append("<tr>" +
                    "<td>" + i + "</td>" +
                    "<td>" + specification + "</td>" +
                    "<td>" + products.specifications[specification] + "</td>" +
                    "</tr>"
                );
                i++;
            }
            $('#specifications').show();
        }
        else {
            $('#specifications').hide();
        }
        $('#largeModal').modal();
    });
});

function showAjaxLoaderMessage() {
    swal({
        title: "Ajax request example",
        text: "Submit to run ajax request",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        setTimeout(function () {
            swal("Ajax request finished!");
        }, 2000);
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
        if (!searchArray[i].includes('page=') && !searchArray[i].includes(except) && searchArray[i] !== '') {
            href += searchArray[i].replace("?", "") + '&';
        }
    }
    href += except + $(el).val();
    location.search = href;
}