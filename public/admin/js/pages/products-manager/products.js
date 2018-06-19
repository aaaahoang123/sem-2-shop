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
        $(tableRows[3]).find('td').last().text(products.description);
        $(tableRows[4]).find('td').last().text(products.categories);
        $(tableRows[5]).find('td').last().text(products.brand);
        $(tableRows[6]).find('td').last().text(products.price + "$");

            if (products.hasOwnProperty('specifications') === true) {
                if ($('#specificationsbody').html() === "") {
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