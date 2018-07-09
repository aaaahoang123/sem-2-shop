function addToCart(el) {
    var cart = {};
    if (Cookies.get('cart')) {
        cart = JSON.parse(Cookies.get('cart'));
    }
    console.log(cart);
    if (cart[$(el).data('code')]) {
        cart[$(el).data('code')].quantity += 1;
    }
    else {
        cart[$(el).data('code')] = {
            "quantity": 1
        };
    }
    Cookies.set('cart', cart);
}