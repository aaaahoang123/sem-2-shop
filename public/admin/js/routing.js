function callPageSingle() {
    let hash = location.hash;
    if (hash === "") hash = "#home";
    renderCss(hash);
    let url = hash.replace("#", "/manager/dashboard/");
    $.ajax({
        url: url,
        method: "GET",
        success: function (res) {
            activeSidebar(hash);
            $.AdminBSB.leftSideBar.refresh();
            $("#main-content").html(res);
            console.log("1");
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
    switch (hash) {
        case "#home":
            arrayCss.push('/admin/plugins/morrisjs/morris.css');
            break;
        case "#web-config/information":
            arrayCss = [];
            break;
        case "#web-config/contact":
            arrayCss = [];
            break;
        case "#web-config/top-category":
            arrayCss = [];
            break;
        case "#product-manager/categories":
            arrayCss = [];
            break;
        case "#product-manager/add-category":
            arrayCss = [];
            break;
        case "#product-manager/brands":
            arrayCss = [];
            break;
        case "#product-manager/add-brand":
            arrayCss = [];
            break;
        case "#product-manager/products":
            arrayCss = [];
            break;
        case "#product-manager/add-product":
            arrayCss = [];
            break;
        case "#customer-manager/customers":
            arrayCss = [];
            break;
        case "#customer-manager/add-customer":
            arrayCss =[];
            break;
        case "#warehouse-manager/check":
            arrayCss =[];
            break;
        case "#warehouse-manager/edit":
            arrayCss = [];
            break;
        case "#warehouse-manager/logs":
            arrayCss = [];
            break;
        default:
            break;
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
    switch (hash) {
        case "#home":
            arrayJS = [
                '/admin/plugins/jquery-countto/jquery.countTo.min.js',
                '/admin/plugins/raphael/raphael.min.js',
                '/admin/plugins/morrisjs/morris.min.js',
                '/admin/plugins/chartjs/Chart.bundle.min.js',
                '/admin/plugins/flot-charts/jquery.flot.min.js',
                '/admin/plugins/flot-charts/jquery.flot.resize.js',
                '/admin/plugins/flot-charts/jquery.flot.pie.min.js',
                '/admin/plugins/flot-charts/jquery.flot.categories.min.js',
                '/admin/plugins/flot-charts/jquery.flot.time.min.js',
                '/admin/plugins/jquery-sparkline/jquery.sparkline.min.js',
                '/admin/js/pages/index.js'
            ];
            break;
        case "#web-config/information":
            arrayJS = [];
            break;
        case "#web-config/contact":
            arrayJS = [];
            break;
        case "#web-config/top-category":
            arrayJS = [];
            break;
        case "#product-manager/categories":
            arrayJS = [];
            break;
        case "#product-manager/add-category":
            arrayJS = [];
            break;
        case "#product-manager/brands":
            arrayJS = [];
            break;
        case "#product-manager/add-brand":
            arrayJS = [];
            break;
        case "#product-manager/products":
            arrayJS = [];
            break;
        case "#product-manager/add-product":
            arrayJS = [];
            break;
        case "#customer-manager/customers":
            arrayJS = [];
            break;
        case "#customer-manager/add-customer":
            arrayJS =[];
            break;
        case "#warehouse-manager/check":
            arrayJS =[];
            break;
        case "#warehouse-manager/edit":
            arrayJS = [];
            break;
        case "#warehouse-manager/logs":
            arrayCss = [];
            break;
        default:
            break;
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

function activeSidebar(hash) {
    console.log(hash);
    var sidebarItem = document.getElementsByClassName("sidebar-item");
    var paths = hash.split("/");
    var length = sidebarItem.length;
    for (var i=0; i<length; i++) {
        sidebarItem[i].className = sidebarItem[i].getAttribute('data-active').includes(paths[0]) || sidebarItem[i].getAttribute('data-active').includes(paths[1])? "sidebar-item active" : "sidebar-item";
        console.log(hash);
    }

    // sidebarItem.attr("class", function () {
    //     console.log($(this).attr("data-active"));
    //     console.log($(this).attr('data-active').includes(hash));
    //    return $(this).attr('data-active').includes(paths[0]) || $(this).attr('data-active').includes(hash)? "sidebar-item active" : "sidebar-item";
    // });
}

// function activeSidebar(hash) {
//     let webConfig = document.getElementById("web-config");
//     let productManager = document.getElementById("product-manager");
//     let customerManager = document.getElementById("customer-manager");
//     let warehouseManager = document.getElementById("warehouse-manager");
//     switch (hash) {
//         case "#web-config/information":
//             webConfig.className = "active";
//             webConfig.querySelector("ul > li.information").className += " active";
//             break;
//         case "#web-config/top-category":
//             webConfig.className = "active";
//             webConfig.querySelector("ul > li.top-category").className += " active";
//             break;
//         case "#product-manager/categories":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.categories").className += " active";
//             break;
//         case "#product-manager/add-category":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.add-category").className += " active";
//             break;
//         case "#product-manager/brands":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.brands").className += " active";
//             break;
//         case "#product-manager/add-brand":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.add-brand").className += " active";
//             break;
//         case "#product-manager/products":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.products").className += " active";
//             break;
//         case "#product-manager/add-product":
//             productManager.className = "active";
//             productManager.querySelector("ul > li.add-product").className += " active";
//             break;
//         case "#customer-manager/customers":
//             customerManager.className = "active";
//             customerManager.querySelector("ul > li.customers").className += " active";
//             break;
//         case "#customer-manager/add-customer":
//             customerManager.className = "active";
//             customerManager.querySelector("ul > li.add-customer").className += " active";
//             break;
//         case "#warehouse-manager/check":
//             warehouseManager.className = "active";
//             warehouseManager.querySelector("ul > li.check").className += " active";
//             break;
//         case "#warehouse-manager/edit":
//             warehouseManager.className = "active";
//             warehouseManager.querySelector("ul > li.edit").className += " active";
//             break;
//         case "#warehouse-manager/logs":
//             warehouseManager.className = "active";
//             warehouseManager.querySelector("ul > li.logs").className += " active";
//             break;
//         default:
//             break;
//     }
// }
//
// function activeOffSidebar(webConfig, productManager, customerManager, warehouseManager) {
//
// }