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
        fillTable(data);
    };
    xhr.send();
}

// Adatok lekérése a szerverről.
getAll("club");

// Táblázat kitöltése.
function fillTable(rows) {
    // HTML elemek keresése.
    var table = document.querySelector("#crudTable");
    var thead = table.querySelector("thead");
    var tbody = table.querySelector("tbody");

    // Tábla kiöblítése.
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Legeneráljuk a fejléceket.
    for (var k in rows[0]) {
        var th = document.createElement("th");
        th.innerHTML = k;
        thead.appendChild(th);
    }

    // Legeneráljuk a táblázat törzsét.
    for (var k in rows) {
        var tr = document.createElement('tr');
        for (var j in rows[k]) {
            var td = document.createElement("td");
            var input = document.createElement("input");
            td.appendChild(input);
            input.value = rows[k][j];
            input.key = j;
            tr.appendChild(td);
        }

        // Gombok.
        var td = document.createElement("td");
        var group = document.createElement("div");
        group.className = "btn-group";

        // Frissítés.
        var btn1 = document.createElement("button");
        btn1.className = "btn btn-info";
        btn1.innerHTML = "frissít";
        btn1.addEventListener("click", function(ev) {
            // A gomb szülő tr megkeresése.
            var parentTr = ev.target.parentElement.parentElement.parentElement;
            
            // Az input elemek keresése a szülő tr-ben.
            var inputs = parentTr.querySelectorAll("input");
            var row = {};
            for (var k in inputs) {
                if (inputs[k].value) {
                    row[inputs[k].key] = inputs[k].value;
                }
            }
            console.log(row);
        });
        
        // Törlés.
        var btn2 = document.createElement("button");
        btn2.className = "btn btn-danger";
        btn2.innerHTML = "töröl";

        group.appendChild(btn1);
        group.appendChild(btn2);
        td.appendChild(group);
        tr.appendChild(td);

        tbody.appendChild(tr);
    }
}