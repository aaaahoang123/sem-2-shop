$('.btn-reset').click(function () {
    $('.spec-name').each(function () {
        $(this).val('')
    });
    $('.spec-value').each(function () {
        $(this).val('')
    })
});

$('.btn-remove').click(function () {
    $(this).parent().parent().remove();
});

$("#add-spec-btn").click(function () {
    var inputF = createInput("book", "Name");
    var inputD = createInput("link", "Href");

    var iconRe = document.createElement("i");
    iconRe.className = "material-icons";
    iconRe.innerHTML = "remove";
    var btnERe = document.createElement("button");
    btnERe.className = "btn btn-danger btn-circle waves-effect waves-circle waves-float";
    btnERe.setAttribute("type", "button");
    btnERe.onclick = function () {
        spec.removeChild(rw);
    };
    var colName = document.createElement("div");
    colName.className = "col-sm-5 contain-name";

    var colVal = document.createElement("div");
    colVal.className = "col-sm-5 contain-value";

    var col1 = document.createElement("div");
    col1.className = "col-sm-1";

    var col1Re = document.createElement("div");
    col1Re.className = "col-sm-1";

    var rw = document.createElement("div");
    rw.className = "row clearfix ahi";

    var spec = document.getElementById("spec");

    colName.appendChild(inputF);
    colVal.appendChild(inputD);
    btnERe.appendChild(iconRe);
    col1Re.appendChild(btnERe);
    rw.appendChild(colName);
    rw.appendChild(colVal);
    rw.appendChild(col1);
    rw.appendChild(col1Re);

    spec.appendChild(rw);
    $.AdminBSB.input.activate();
});

var createInput = function(icon, placeholder) {

    var ip = document.createElement("input");
    if(placeholder === "Name"){
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

    formLine.appendChild(ip);
    spanE.appendChild(iEl);
    inputGroup.appendChild(spanE);
    inputGroup.appendChild(formLine);

    return inputGroup;
};

$('.btn-sub').click(function () {
    let arr = [], name = '', href = '', bool = true;
    $('.ahi').each(function () {
        name = $(this).find('.spec-name').val();
        href = $(this).find('.spec-value').val();
        if (name === '') {
            $(this).find('.text-name').remove();
            $(this).find('.contain-name').append(`<p class="text-name text-danger text-center m-t-15">Name can not be null!</p>`);
        } else $(this).find('.text-name').remove();
        if (href === '') {
            $(this).find('.text-href').remove();
            $(this).find('.contain-value').append(`<p class="text-href text-danger text-center m-t-15">Href can not be null!</p>`);
        } else $(this).find('.text-href').remove();
        if (name !== '' && href !== '' && bool === true) {
            arr.push({name: name, href: href});
            bool = true;
        } else bool = false;
    });
    if (bool === true) $.post('/api/nav-bar', {"data": JSON.stringify(arr)}).done(function () {
        $('.alert.alert-success.text-center').attr('hidden', false);
        location.reload();
    });
});



