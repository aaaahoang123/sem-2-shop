function callPageSingle() {
    let hash = location.hash;
    if (hash === "") hash = "#home";
    console.log(hash);
    renderCss(hash);
    let url = hash.replace("#", "/manager/dashboard/");
    console.log(url);
    $.ajax({
        url: url,
        method: "GET",
        success: function (res) {
            $("#main-content").html(res);
            renderJS(hash);
        },
        error: function (res) {
            alert('Đã xảy ra lỗi khi tải trang, vui lòng check logs!');
            console.log(res);
        }
    });
}

$(document).ready(function () {
    callPageSingle();
});

function renderCss(hash) {
    let arrayCss = [];
    if (hash === '#home') {
        arrayCss = [
            '/admin/plugins/morrisjs/morris.min.css',
        ];
    }
    if (hash === '#website-config/information') {
        arrayCss = [
            '/admin/plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
            '/admin/plugins/waitme/waitMe.min.css',
            '/admin/plugins/bootstrap-select/css/bootstrap-select.min.css',
            'https://use.fontawesome.com/releases/v5.0.13/css/all.css'
        ];
        // arrayCss = [
        //
        // ];
    }

    let link, parent = document.getElementById('extra-css');
    for (let css of arrayCss) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = css;
        parent.appendChild(link);
    }
}


function renderJS(hash) {
    let arrayJS = [];
    if (hash === '#home') {
        arrayJS = [
            '/admin/plugins/raphael/raphael.min.js',
            '/admin/plugins/morrisjs/morris.min.js',
            '/admin/js/pages/charts/morris.js'
        ];
    }
    if (hash === '#website-config/information') {
        arrayJS = [
            '/admin/plugins/autosize/autosize.min.js',
            '/admin/plugins/momentjs/moment.min.js',
            '/admin/plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.min.js',
            '/admin/js/pages/forms/basic-form-elements.js',
            '/admin/js/form-init.js'
        ];
    }

    let script;
    let parent = document.getElementById('extra-js');
    parent.innerHTML = "";
    for (let js of arrayJS) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = js;
        parent.appendChild(script);
    }

}