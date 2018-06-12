function callPageSingle() {
    let hash = location.hash;
    if (hash === "") hash = "#home";
    renderCss(hash);
    let url = hash.replace("#", "/manager/dashboard/");
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