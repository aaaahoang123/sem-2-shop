var FILE_UPLOAD_URL = "https://api.cloudinary.com/v1_1/fpt-aptech/image/upload";

CKEDITOR.replace('ckeditor');
CKEDITOR.config.height = 205;

function uploadImg(e) {
    $('#img-mask').addClass('show-bitch');
    var img = new FormData();
    img.append('file', e.target.files[0]);
    console.log(e.target.files[0]);
    img.append('upload_preset', 'gwq6ik7v');
    $.ajax({
        url: FILE_UPLOAD_URL,
        type: "POST",
        data: img,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response){
            $('#inpUpload').val(response.secure_url);
            $('#blah').attr('src', response.secure_url);
        },
        error: function(response, message){
            console.log(response);
        },
        complete: function () {
            $('#img-mask').removeClass('show-bitch');
        }
    });
}

$("#imgInp").change(uploadImg);
$('#form1').submit(function (e) {
    $('#about-us').val(CKEDITOR.instances.ckeditor.getData());
});

$('#btn-clear').on('click', function () {
    var forms = document.forms['form-infor'];
    forms['logo'].value = '';
    forms['slogan'].value = '';
    forms['name'].value = '';
    CKEDITOR.instances.ckeditor.setData('');
    document.getElementById('blah').setAttribute('src', '/admin/images/placeholder.png');
});

$('#btn-reset').on('click', function () {
    location.reload();
});

