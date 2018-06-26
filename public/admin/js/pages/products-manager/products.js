$(function () {

    // sweetalert
    $('.js-sweetalert button[data-type="ajax-loader"]').on('click', showAjaxLoaderMessage);

    // modal
    $('.js-modal-buttons .btn.btn-detail').on('click', function () {
        let products = JSON.parse($(this).attr('data-p'));
        console.log(products);
        var tableRows = $('#detail-modal > tr');
        $(tableRows[0]).find('td').last().text(products.code);
        $(tableRows[1]).find('td').last().find('div').css('background-image', 'url(' + products.images[0] + ')');
        $(tableRows[2]).find('td').last().text(products.name);
        $(tableRows[3]).find('td').last().html(products.description);
        var categoriesCol = $(tableRows[4]).find('td').last();
        categoriesCol.html('');
        products.categories.forEach(function (data, index) {
            categoriesCol.append(data.name);
            if(index !== products.categories.length-1){
                categoriesCol.append(", ");
            }
        });
        $(tableRows[5]).find('td').last().text(products.brand[0].name);
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

        var btnEdit = document.getElementById("btn-edit");
        btnEdit.href = '/manager/dashboard/products-manager/products/'+products.code+'/edit';
        var btnDelete = document.getElementById("btn-delete");
        btnDelete.setAttribute('data-p',$(this).attr('data-p'));
        $('#largeModal').modal();
    });
});

function showAjaxLoaderMessage() {
    var products = $(this).data('p');
    swal({
        title: "Do you want to delete product: " +products.name,
        text: "Submit to delete this product",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        $.ajax({
            url: "http://localhost:3000/api/products/"+ products.code,
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
                    swal("Fail to delete. Error: " + res.message);
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
        if (!searchArray[i].includes('page=') && !searchArray[i].includes(except) && searchArray[i] !== '') {
            href += searchArray[i].replace("?", "") + '&';
        }
    }
    href += except + $(el).val();
    location.search = href;
}