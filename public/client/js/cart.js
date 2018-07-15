$(document).ready(function () {
    allTotalPrice();
});
var cart = JSON.parse(Cookies.get("cart"));

function countTotalPrice(e) {
    cart[$(e).data('code')].quantity = parseInt(e.value);
    $('.' + $(e).data('code')).html(e.value * parseInt($('.price-' + $(e).data('code')).html()));
    allTotalPrice();
    Cookies.set('cart', cart);
}

function removeProduct(e) {
    cartLength = Object.keys(cart).length;
    $('#sticky').html(cartLength - 1);
    $('#cartHeader').html(cartLength - 1);
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
    allTotalPrice();
}

function allTotalPrice() {
    var total = 0;
    $('.total-price').get().forEach(function (el) {
        total += parseInt($(el).html());
    });
    $('.order_total_amount').html(total);
}

$(".cart_button_checkout").click(function () {
    var token = Cookies.get("token");
    if (token === undefined) {
        showNotification("alert-warning", "Please login to place an order", "bottom", "left", "animated bounceIn", "animated bounceOut");
    }
    else location.href = "/order";
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