
const UPLOAD_IMG_URL = "https://api.cloudinary.com/v1_1/fpt-aptech/image/upload";

$(function () {
    CKEDITOR.replace('ckeditor');
    CKEDITOR.instances.ckeditor.on('contentDom', function () {
        CKEDITOR.instances.ckeditor.document.on('keyup', function () {
            console.log(CKEDITOR.instances.ckeditor.getData());
            validateDescription(document.getElementById('ckeditor'));
        });
    });
    CKEDITOR.config.height = 300;


    //Dropzone
    Dropzone.options.frmFileUpload = {
        url: UPLOAD_IMG_URL,
        paramName: "file",
        params: {
            upload_preset: 'gwq6ik7v'
        },
        maxFilesize: 2,
        addRemoveLinks: true,
        error: function (file, err) {
            console.log(err);
        },
        success: function (file, res) {
            console.log(res);
            var ip = document.createElement("input");
            ip.setAttribute("type", "hidden");
            ip.setAttribute("class", "urlImg");
            ip.setAttribute("name", file.name);
            ip.value = res.secure_url;
            var urlImages = document.getElementById("url-images");
            urlImages.appendChild(ip);
        },

        init: function () {
            /**
             * r dùng để phân biệt khi xóa images bằng tay và clear dropzone bằng button reset.
             *
             * Nếu xóa bằng tay(r=0), mỗi lần xóa sẽ gọi hàm validateImages trong callback của event removedfile, nếu xóa hết thì
             * sẽ thông báo 'Please choice images' dưới dropzone.
             *
             * Nếu clear dropzone bằng button reset , add event click đến button reset , gán r = 1, gọi hàm removeAllFiles()
             * khi đó event removedfile sẽ đc trigger nhưng r =1 (ko gọi validateImages).
             * @type {number}
             */
            var r = 0;
            this.on("success", function () {
                validateImages(document.getElementById("frm-file-upload"), getValueImages());
            });
            this.on("removedfile", function (file) {
                console.log(file.name);
                $("#url-images > input[name='"+ file.name +"']").remove();
                if(r === 0) validateImages(document.getElementById("frm-file-upload"), getValueImages());
            });

            var _this = this;
            document.getElementById("btn-reset").addEventListener("click", function() {
                r = 1;
                _this.removeAllFiles();
            });

            var inputs = document.getElementById("url-images").querySelectorAll(".edit-img");
            for(var i=0; i< inputs.length; i++){
                var mockFile = { name: inputs[i].name, size: 1, type: 'image/jpeg' };
                _this.emit("addedfile", mockFile);
                _this.emit("thumbnail", mockFile, inputs[i].value);
                _this.emit("complete", mockFile);
                _this.files.push( mockFile );
            }
        }
    };

    //Multi-select
    $('#optgroup').multiSelect({ selectableOptgroup: true });
});

function removeSpecRow(elm){
    $(elm).parent().parent().remove();
}
$("#add-spec-btn").click(function () {
    var inputF = createInput("settings", "Feature");
    var inputD = createInput("details", "Details");

    var iconRe = document.createElement("i");
    iconRe.className = "material-icons";
    iconRe.innerHTML = "remove";
    var btnERe = document.createElement("button");
    btnERe.className = "btn btn-danger btn-circle waves-effect waves-circle waves-float";
    btnERe.setAttribute("type", "button");
    btnERe.onclick = function () {
        spec.removeChild(rw);
    };

    var col1 = document.createElement("div");
    col1.className = "col-sm-1";

    var col1Re = document.createElement("div");
    col1Re.className = "col-sm-1";

    var rw = document.createElement("div");
    rw.className = "row clearfix";

    var spec = document.getElementById("spec");

    btnERe.appendChild(iconRe);
    col1Re.appendChild(btnERe);
    rw.appendChild(inputF);
    rw.appendChild(inputD);
    rw.appendChild(col1);
    rw.appendChild(col1Re);

    spec.appendChild(rw);
    $.AdminBSB.input.activate();
});


var createInput = function(icon, placeholder) {

    var ip = document.createElement("input");
    if(placeholder === "Feature"){
        ip.className = "form-control date spec-name";
    }else {
        ip.className = "form-control date spec-value";
    }
    ip.setAttribute("type", "text");
    ip.setAttribute("placeholder", placeholder);
    var formLine = document.createElement("div");
    formLine.className = "form-line";

    var iEl = document.createElement("i");
    iEl.className = "material-icons";
    iEl.innerHTML = icon;

    var spanE = document.createElement("span");
    spanE.className = "input-group-addon";

    var inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    var col = document.createElement("div");
    col.className = "col-sm-5";

    formLine.appendChild(ip);
    spanE.appendChild(iEl);
    inputGroup.appendChild(spanE);
    inputGroup.appendChild(formLine);
    col.appendChild(inputGroup);

    return col;
};


$("#btn-submit").click(function () {

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
        req.open("POST", "/api/products");
        req.setRequestHeader("Content-Type", "application/json");
        req.onload = function () {
            console.log(this.responseText);
            console.log(req.status);
            if (req.status === 200 || req.status === 201) {
                showNotification("alert-success", "Add Product Successfully", "bottom", "right", "animated bounceIn", "animated bounceOut");
                setTimeout(function () {
                    location.reload();
                }, 500);

            } else {
                console.log(this.responseText);
                showNotification("alert-danger", "Add Product Fail", "bottom", "right", "animated bounceIn", "animated bounceOut");
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

$('#btn-reset').click(function () {
    $("#category select").val('default');
    $("#category select").selectpicker('refresh');

    $("#brand select").val('default');
    $("#brand select").selectpicker('refresh');

    var forms = document.forms['product-form'];
    forms['name'].value = "";
    forms['price'].value = "";
    forms['code'].value = "";

    CKEDITOR.instances.ckeditor.setData('');

    $('#spec').html("");

    var labels = document.querySelectorAll("div > label");
    for(var i = 0; i < labels.length; i++){
        labels[i].innerHTML = "";
        labels[i].removeAttribute('class');
        if(labels[i].parentElement.querySelector("div.form-line") === null || labels[i].parentElement.querySelector("div.form-line") === undefined){
            continue;
        }
        if(labels[i].parentElement.querySelector("div.form-line").className.includes("success")){
            labels[i].parentElement.querySelector("div.form-line").className = labels[i].parentElement.querySelector("div.form-line").className.replace(" success","");
            labels[i].parentElement.querySelector("div.form-line").className = labels[i].parentElement.querySelector("div.form-line").className.replace(" focused","");
        }
        if(labels[i].parentElement.querySelector("div.form-line").className.includes("error")){
            labels[i].parentElement.querySelector("div.form-line").className = labels[i].parentElement.querySelector("div.form-line").className.replace(" error","");
            labels[i].parentElement.querySelector("div.form-line").className = labels[i].parentElement.querySelector("div.form-line").className.replace(" focused","");
        }
    }

    if(document.getElementById("alert-error").className !== ""){
        document.getElementById("alert-error").className = "";
        document.getElementById("alert-error").innerHTML = "";
    }
});

function createButtonLoader(e) {
    e.setAttribute("disabled", "");
    e.innerHTML = "<div class=\"preloader pl-size-xs\">" + "<div class=\"spinner-layer pl-grey\">"
        + "<div class=\"circle-clipper left\">" + "<div class=\"circle\"></div>" + "</div>"
        + "<div class=\"circle-clipper right\">" + "<div class=\"circle\"></div>"
        + "</div>" + "</div>" + " </div>";
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
            template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
        });
}

var validateProductName = function (elm) {
    var alert = elm.parentElement.parentElement.querySelector("label");
    if(checkNull(elm.value)){
        createAlert(alert,elm,"Please enter Product Name.");
        return false;
    }else {
        removeAlert(alert,elm);
        return true;
    }
};

var validateProductPrice = function (elm) {
    var alert = elm.parentElement.parentElement.querySelector("label");
    if(checkNull(elm.value)){
        createAlert(alert,elm,"Please enter Product Price.");
        return false;
    }else {
        removeAlert(alert,elm);
        return true;
    }
};

var validateProductCode = function (elm) {
    var alert = elm.parentElement.parentElement.querySelector("label");
    if(checkNull(elm.value)){
        createAlert(alert,elm,"Please enter Product Code.");
        return false;
    }else {
        removeAlert(alert,elm);
        return true;
    }
};

var validateCategory = function (elm) {

    var alert = elm.parentElement.parentElement.parentElement.querySelector("label");
    if(checkNull($('#category select').val())){
        createAlert(alert,elm.parentElement,"Please choice Category.");
        return false;
    }else {
        removeAlert(alert,elm.parentElement);
        return true;
    }
};

var validateBrand = function (elm) {

    var alert = elm.parentElement.parentElement.parentElement.querySelector("label");
    if(checkNull(elm.value)){
        createAlert(alert,elm.parentElement,"Please choice Brand.");
        return false;
    }else {
        removeAlert(alert,elm.parentElement);
        return true;
    }
};

var validateDescription = function (elm) {
    var alert = elm.parentElement.parentElement.querySelector("label");
    if(checkNull(CKEDITOR.instances.ckeditor.getData())){
        createAlert(alert,elm,"Please enter Product Description.");
        return false;
    }else {
        removeAlert(alert,elm);
        return true;
    }
};

var validateImages = function (elm, images) {
    var alert = elm.parentElement.querySelector("label");
    if(images.length === 0){
        createAlert(alert,elm,"Please choice Images.");
        return false;
    }else {
        removeAlert(alert,elm);
        return true;
    }
};

var getValueImages = function () {
    var inputUrlImg,  images = [];
    if($('#url-images').html() !== "" || $('#url-images').html() !== null){
        inputUrlImg = document.getElementsByClassName("urlImg");
        for (var i = 0; i < inputUrlImg.length; i++){
            images.push(inputUrlImg[i].value);
        }
    }
    return images;
};

var getValueSpeci = function () {
    var specName, specValue, speccification = {};

    if($('#spec').html() !== "" || $('#spec').html() !== null){
        specName = document.getElementsByClassName("spec-name");
        specValue = document.getElementsByClassName("spec-value");
        for(var i=0; i< specName.length; i++){
            speccification[specName[i].value] = specValue[i].value;
        }
    }
    return speccification;
};

function checkNull(value) {
    var regex = XRegExp('^\\s+$');
    if(value == null || regex.test(value) || value === ""){
        return true;
    }
    return false;
}

function createAlert(alert, elm, str) {
    alert.innerHTML = str;
    alert.className = "error";
    if(elm.parentElement.className.includes('form-line')){
        if(elm.parentElement.className.includes("success")){
            elm.parentElement.className = elm.parentElement.className.replace(" success", "");
        }
        if(!elm.parentElement.className.includes("error")){
            elm.parentElement.className += " error";
        }
    }
}

function removeAlert(alert, elm) {
    alert.removeAttribute('class');
    alert.innerHTML = "";
    if(elm.parentElement.className.includes('form-line')){
        if(elm.parentElement.className.includes("error")){
            elm.parentElement.className = elm.parentElement.className.replace(" error", "");
        }
        if(!elm.parentElement.className.includes("success")){
            elm.parentElement.className += " success";
        }
    }
}

function creatAlertResponeErrorServer(e) {
    var alertError = document.getElementById("alert-error");
    if(!alertError.className.includes("alert bg-red")){
        alertError.className = "alert bg-red";
    }
    alertError.innerHTML = JSON.parse(e.responseText).message;

    if(document.getElementById('code').className.includes("success")){
        document.getElementById('code').className = document.getElementById('code').className.replace("success", "error");
    }
}