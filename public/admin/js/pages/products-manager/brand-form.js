var FILE_UPLOAD_URL = "https://api.cloudinary.com/v1_1/fpt-aptech/image/upload";


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
