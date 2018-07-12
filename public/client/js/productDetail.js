$('.btn-add-to-cart').click(addToCart);
function addToCart() {
    var cart = {};
    if (Cookies.get('cart')) {
        cart = JSON.parse(Cookies.get('cart'));
    }
    if (cart[$(this).data('code')]) {
        cart[$(this).data('code')].quantity = parseInt($('#quantity_input').val());
    }
    else {
        cart[$(this).data('code')] = {
            "quantity": parseInt($('#quantity_input').val())
        };
    }
    showNotification("alert-success", "Add to cart Success", "bottom", "left", "animated bounceIn", "animated bounceOut");
    Cookies.set('cart', cart);
}

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