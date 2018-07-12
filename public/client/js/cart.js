$(document).ready(function () {
    var arrItemChecked = $("input:checked");
    if ($(".toCountTotal").length === $(".item-checkbox").length)  $('#check-all').prop('checked', true);
    for (var i = 0; i < arrItemChecked.length; i++) {
        var total = document.createElement('input');
        total.id = "Total" + arrItemChecked[i].id;
        total.className = "toCountTotal";
        total.type = "hidden";
        total.value = $('.' + arrItemChecked[i].id).html();
        $('.cart_items').append(total);
        $('.inp-' + $(arrItemChecked[i]).val()).prop("readonly", true);
        $('.btn-' + arrItemChecked[i].id).prop("disabled", true);
        $('.btn-' + arrItemChecked[i].id).css("cursor", "");
    }
    countToTalAllProduct();
});
var cart = JSON.parse(Cookies.get("cart"));

function countTotalPrice(e) {
    cart[$(e).data('code')].quantity = parseInt(e.value);
    $('.' + $(e).data('code')).html(e.value * parseInt($('.price-' + $(e).data('code')).html()));
    Cookies.set('cart', cart);
}

var itemCheckbox = $('.item-checkbox');
$('#check-all').change(function () {
    itemCheckbox.prop('checked', $(this).prop('checked'));
    itemCheckbox.trigger('change');
});

$(itemCheckbox).change(function () {
    if (!$(this).prop('checked')) $('#check-all').prop('checked', false);
});

function checkItem(e) {
    if (e.checked) {
        console.log($(".toCountTotal").length);
        console.log($(".item-checkbox").length);
        console.log($(".toCountTotal").length === $(".item-checkbox").length);
        $('.inp-' + $(e).val()).prop("readonly", true);
        $('.btn-' + e.id).prop("disabled", true);
        $('.btn-' + e.id).css("cursor", "");
        if ($('#Total' + e.id).length === 0) {
            var total = document.createElement('input');
            total.id = "Total" + e.id;
            total.className = "toCountTotal";
            total.type = "hidden";
            total.value = $('.' + e.id).html();
            $('.cart_items').append(total);
        }
        if ($(".toCountTotal").length === $(".item-checkbox").length)  $('#check-all').prop('checked', true);
        cart[e.id].selected = true;
    }
    else {
        $('.inp-' + $(e).val()).removeAttr("readonly");
        $('.btn-' + e.id).removeAttr("disabled");
        $('.btn-' + e.id).css("cursor", "pointer");
        $('#Total' + e.id).remove();
        delete cart[e.id].selected;
    }
    Cookies.set('cart', cart);
    countToTalAllProduct();
}

function countToTalAllProduct() {
    var arrPrice = $(".toCountTotal");
    var sum = 0;
    for (var i = 0; i < arrPrice.length; i++) {
        sum += parseInt(arrPrice[i].value);
    }
    $('.order_total_amount').html(sum);
}
function removeProduct(e) {
    delete cart[$(e).data('code')];
    Cookies.set("cart", cart);
    if ($('.tr').length === 1) {
        $('#shoppingCart').remove();
        $('.cart_section > .container').html(
            "<div class='row text-center'>" +
                "<div class='col-lg-12'>" +
                    "<h1>No product in your cart</h1>" +
                "</div>" +
                "<div class='col-lg-12'>" +
                    "<a class='button cart_button_clear' href='/' style='margin: 50px'>Continue shopping</a>" +
                "</div>" +
            "</div>"
        );
    }
    $('.tr-' + $(e).data('code')).remove();
}

$(".cart_button_checkout").click(function () {
    var token = Cookies.get("token");
    console.log(token);
    if (token === undefined) {
        showNotification("alert-warning", "Please login to place an order", "bottom", "left", "animated bounceIn", "animated bounceOut");
    }
    if ($("input:checked").length === 0) {
        showNotification("alert-warning", "You have not selected any products yet", "bottom", "left", "animated bounceIn", "animated bounceOut");
    }
    if (token && $("input:checked").length !== 0) location.href = "/order";
});

function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) {
    if (colorName === null || colorName === '') { colorName = 'bg-black'; }
    if (text === null || text === '') { text = 'Turning standard Bootstrap alerts'; }
    if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
    if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
    var allowDismiss = true;

    $.notify({
            message: text
        },
        {
            type: colorName,
            allow_dismiss: allowDismiss,
            newest_on_top: true,
            timer: 1000,
            placement: {
                from: placementFrom,
                align: placementAlign
            },
            animate: {
                enter: animateEnter,
                exit: animateExit
            },
            template: '<div data-notify="container" style="background-color: #2b982b; color: #fff" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
        });
}