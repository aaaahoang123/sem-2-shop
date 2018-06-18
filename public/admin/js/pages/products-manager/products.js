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
        $('.productCode-modal').text(products.code);
        $('.productImg-modal').css('background-image', 'url(' + products.images + ')');
        $('.productName-modal').text(products.name);
        $('.productDescription-modal').text(products.description);
        $('.productCategory-modal').text(products.categories);
        $('.productBrand-modal').text(products.brand);
        $('.productPrice-modal').text(products.price + "$");

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