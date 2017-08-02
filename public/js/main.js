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

function getAll(table) {
    var url = "/api/"+table;
    var xhr = new XMLHttpRequest;
    xhr.open("get", url);
    xhr.onload = function(ev) {
        var data = JSON.parse(ev.target.response);
        console.log(data);
    };
    xhr.send();
}