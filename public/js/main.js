// Delete request.
function delRequest(index) {
    var url = "/api/club/" + index;
    var xhr = new XMLHttpRequest;
    xhr.open("delete", url);
    xhr.onload = function(ev) {
        console.log(ev.target.response);
    };
    xhr.send();
}