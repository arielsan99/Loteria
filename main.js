/* global d3 */
//array2 se cargan los registros del csv
var array2 = [];
//final se almacenan las calificaciones de los estudiantes seleccionados
var final = [];
function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    let lines = contenido.split(/\n/);
    lines.forEach(line =>
      array2.push(line)
    );
    mostrarContenido();
  };
  lector.readAsText(archivo);
}

function mostrarContenido() {
  const options = d3.shuffle(array2);

  // https://cmatskas.com/get-url-parameters-using-javascript/
  var parseQueryString = function(url) {
    var urlParams = {};
    url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function(
      $0,
      $1,
      $2,
      $3
    ) {
      urlParams[$1] = $3;
    });

    return urlParams;
  };

  var params = parseQueryString(location.search);
  if (params && params.section === "2") {
    options = [];
  }

  var allOptions = options.map(function(d, i) {
    return { name: d, id: i, drawn: false };
  });
  var optionsLeft = allOptions.map(function(d) {
    return d;
  });
  var optionsDrawn = [];

  var width = 800,
    height = 800,
    endAngle = 360 - 180 / options.length;

  var svg = d3
    .select("#result")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var angleScale = d3.scale
    .linear()
    .domain([0, options.length - 1])
    .range([0, endAngle]);

  d3.select("#btnChoose").on("click", onChoose);

  function redraw(options) {
    var optionsSel = svg.selectAll(".option").data(options);

    optionsSel
      .enter()
      .append("text")
      .attr("class", "option");

    optionsSel
      // .attr("x", width/2)
      // .attr("y", height/2)
      .attr("id", function(d) {
        return "id" + d.id;
      })
      .classed("drawn", function(d) {
        return d.drawn;
      })
      .text(function(d) {
        return d.name;
      })
      .transition()
      .duration(1000)
      .attr("transform", function(d) {
        return (
          "translate(" +
          (width / 2 - 9 * options.length) +
          "," +
          height / 2 +
          ") rotate(" +
          angleScale(d.id) +
          ")" +
          ", translate(" +
          9 * options.length +
          ",0)"
        );
      });

    optionsSel.exit().remove();
  }

  redraw(allOptions);

  function onChoose() {
    var sel = Math.floor(Math.random() * optionsLeft.length);
    var optionSel = optionsLeft.splice(sel, 1)[0];

    if (optionSel === undefined) {
      alert("No hay mas estudiantes");
    }

    optionSel.drawn = true;
    optionsDrawn = [optionSel].concat(optionsDrawn);
    angleScale.range([0, endAngle]);
    var selAngle = angleScale(optionSel.id);

    angleScale.range([-selAngle, endAngle - selAngle]);
    console.log("#id " + sel);
    d3.selectAll(".option").classed("selected", false);
    redraw(allOptions);
    console.log("#id" + optionSel.id);
    d3.select("#id" + optionSel.id).classed("selected", true);

    var drawn = d3
      .select("#drawn")
      .selectAll(".drawn")
      .data(optionsDrawn);
      var last = 1;
    drawn.enter().append("p");
    drawn.attr("class", "drawn").text(function(d) {
      let lines = d.name.split(",");
      if(last==1){
        while(true){
        	var point = prompt("Calificacion de "+lines[0]);
        	if(!isNaN(point) && point != null && point != ""){
          	break;
        	}else{
        		alert('Ingrese un numero');
          	continue;
        	}
        }
        lines[1]=parseInt(lines[1])+parseInt(point);
        last=2;
        final.push(lines)
        var i = array2.indexOf( d.name );
        array2.splice( i, 1 );
      }else{
        var cal = 0;
      }
      d.name=lines;
      return d.name[0]+"  Puntos : "+d.name[1];
    });
    drawn.exit().remove();

    // d3.select("#result").text("Seleccionado = " + options[sel]);
  }
}

function download_csv() {
  final= array2.concat(final)
  var csvString = final.join("\r\n");
  var a = document.createElement('a');
  a.href='data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
  a.target='_blank';
  a.download='students.csv';
  document.body.appendChild(a);
  a.click();
}
document.getElementById('file-input')
  .addEventListener('change', leerArchivo, false);
