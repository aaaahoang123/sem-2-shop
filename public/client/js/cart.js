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