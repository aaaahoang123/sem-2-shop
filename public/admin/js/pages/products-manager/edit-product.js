$("#edit-btn-submit").click(function () {

    var btn = this;

    var specification = getValueSpeci();
    var images = getValueImages();

    var forms = document.forms['product-form'];
    var n = validateProductName(forms['name']);
    var p = validateProductPrice(forms['price']);
    var pc = validateProductCode(forms['code']);
    var d = validateDescription(forms['description']);
    var c = validateCategory(forms['category']);
    var b = validateBrand(forms['brand']);
    var i = validateImages(document.getElementById("frm-file-upload"), images);

    if (n && p && pc && d && c && b && i) {
        createButtonLoader(btn);
        var productData = {
            "code": forms['code'].value,
            "name": forms['name'].value,
            "description": CKEDITOR.instances.ckeditor.getData(),
            "categories": $('#category select').val(),
            "brand": forms['brand'].value,
            "price": parseInt(forms['price'].value),
            "specifications": specification,
            "images": images
        };

        var req = new XMLHttpRequest();
        req.open("PUT", "/api/products/"+ forms['code'].value);
        req.setRequestHeader("Content-Type", "application/json");
        req.onload = function () {
            console.log(this.responseText);
            console.log(req.status);
            if (req.status === 200 || req.status === 201) {
                showNotification("alert-success", "Edit Product Successfully", "bottom", "right", "animated bounceIn", "animated bounceOut");
                setTimeout(function () {
                    location.reload();
                }, 500);

            } else {
                console.log(this.responseText);
                showNotification("alert-danger", "Edit Product Fail", "bottom", "right", "animated bounceIn", "animated bounceOut");
                creatAlertResponeErrorServer(this);
            }
        };
        req.onerror = function () {
            console.log(req.status);
        };
        req.onloadend = function () {
            btn.removeAttribute("disabled");
            btn.innerHTML = "SUBMIT";
        };
        req.send(JSON.stringify(productData));
    }
});
