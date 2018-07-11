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
    Cookies.set('cart', cart);
}