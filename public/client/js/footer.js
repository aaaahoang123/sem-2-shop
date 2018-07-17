$('button.btn-sub').click(function () {
    let footer = [];
    if ($('.title1').val() !== '') {
        if ($('#select1').val() !== null) blog1 = $('#select1').val();
        else blog1 = [];
        footer.push({
            title: $('.title1').val(),
            blogs: blog1
        });
    }
    if ($('.title2').val() !== '') {
        if ($('#select2').val() !== null) blog2 = $('#select2').val();
        else blog2 = [];
        footer.push({
            title: $('.title2').val(),
            blogs: blog2
        });
    }
    if ($('.title3').val() !== '') {
        if ($('#select3').val() !== null) blog3 = $('#select3').val();
        else blog3 = [];
        footer.push({
            title: $('.title3').val(),
            blogs: blog3
        });
    }
    $.post('/api/footer', {"footer": JSON.stringify(footer)}).done(function () {
        $('.alert.alert-success.text-center').attr('hidden', false);
        setTimeout(function(){
            window.location.reload();
        }, 2000);
    });
});