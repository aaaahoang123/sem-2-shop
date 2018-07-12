$(document).ready(function () {
    var arrItemChecked = $("input:checked");
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

function checkItem(e) {
    if (e.checked) {
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