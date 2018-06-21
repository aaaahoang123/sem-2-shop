$(function () {
    CKEDITOR.replace('ckeditor');
    CKEDITOR.config.height = 300;

    //Dropzone
    Dropzone.options.frmFileUpload = {
        paramName: "file",
        maxFilesize: 2
    };

    //Multi-select
    $('#optgroup').multiSelect({ selectableOptgroup: true });


});

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
    ip.className = "form-control date";
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