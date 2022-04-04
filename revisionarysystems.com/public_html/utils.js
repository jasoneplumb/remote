function layarc(data, parent, opacity, size)
{ // Add svg arcs, and insert it into the page at the provided
  // insertion point.
  function round(val) { return val.toPrecision(5); }
  if (data == undefined) alert("data not provided to layarc()");
  function cx(r, d) { return r * Math.cos(d*Math.PI/180); }
  function cy(r, d) { return r * Math.sin(d*Math.PI/180); }
  function AddToolTip(name, element)
  {
      var subElement = document.createElementNS(xmlns, "title");
      var node = document.createTextNode(name);
      subElement.appendChild(node);
      element.appendChild(subElement);
  }
  // Create an outer svg element to contain the arcs
  var xmlns = "http://www.w3.org/2000/svg";
  if (size == undefined) size = 700;
  if (opacity == undefined) opacity = 0.5;
  var x = size/2;
  var y = x;
  var svgElem = document.createElementNS(xmlns, "svg");
  svgElem.setAttributeNS(null, "width", String(x*2));
  svgElem.setAttributeNS(null, "height", String(y*2));
  var style = document.createElement("style");
  style.innerHTML = ".arc:hover { opacity: "+opacity/2+"; }";
  svgElem.appendChild(style); 
  // Add arcs of increasing diameter and decreasing thickness
  var CENTER_SIZE = x / data.arcs.length;
  var thickness = CENTER_SIZE;
  var dt = thickness / (data.arcs.length * 1.15);
  var r = thickness; // (r)adius
  for (var a = 0; a < data.arcs.length; a++)
  {
    // We need a path attribute for each arc
    var path = document.createElementNS(xmlns, "path");
    path.setAttributeNS(null, 'class', 'arc');
    // Add a move command (to the start of the arc)
    thickness -= dt; // For now, us a simple decay function
    r += thickness + size / 500;
    var sa = data.arcs[a].start; // start angle
    var coords = "M"+round(x+cx(r,sa))+","+round(y+cy(r,sa));
    // Then, encode the remaining path description:
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    coords += " A"+round(r)+","+round(r);
    var ea = data.arcs[a].end; // end angle
    var largeArc = 1;
    if (ea-sa <= 180) largeArc = 0;
    coords += " 0 "+largeArc+",1";
    coords += " "+round(x+cx(r,ea))+","+round(y+cy(r,ea));   
    path.setAttributeNS(null, 'd', coords);
    // Derive the color code from the name
    {
      var cval = 0;
      var WHITE = 16777215; // This is 0xFFFFFF in decimal
      for (var ch = 0; ch < data.arcs[a].name.length; ch++)
      {
        cval *= 10;
        var ASCII_ZERO = 48;
        cval += (data.arcs[a].name.charCodeAt(ch) - ASCII_ZERO);
        if (cval > WHITE) cval &= WHITE; // Avoid NaNs
      }
      var LARGE_PRIME = 32452843; // two-million'th
      cval *= LARGE_PRIME;
      cval &= WHITE;
      // Convert the value into a color hex code
      var color = "#"+cval.toString(16).toUpperCase();
    }
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', String(round(thickness)));
    path.setAttributeNS(null, 'fill', "none");
    path.setAttributeNS(null, 'opacity', opacity);
    AddToolTip(data.arcs[a].name, path);
    svgElem.appendChild(path);
  }
  // Draw the center circle
  r = CENTER_SIZE;
  var THREE_SIXTY = 360-parseFloat('2e-'+3);
  sa = 0; ea = THREE_SIXTY;
  coords = "M"+(x+cx(r,sa))+","+(y+cy(r,sa));
  coords += " A"+r+","+r;
  coords += " 0 1,1";
  coords += " "+(x+cx(r,ea))+","+(y+cy(r,ea));
  path = document.createElementNS(xmlns, "path");
  path.setAttributeNS(null, 'class', 'arc');
  path.setAttributeNS(null, 'd', coords);
  color = "#000000"; // "#FF9933";
  path.setAttributeNS(null, 'stroke', color);
  path.setAttributeNS(null, 'stroke-width', String(CENTER_SIZE));
  path.setAttributeNS(null, 'opacity', opacity);
  path.setAttributeNS(null, 'fill', color);
  AddToolTip("layarc", path);
  svgElem.appendChild(path);
  // Add center text
  var textElement = document.createElementNS(xmlns, "text");
  textElement.setAttribute('x', String(round(size/2)));
  textElement.setAttribute('y', String(round(size/75+size/2)));
  textElement.setAttribute('text-anchor', "middle");
  textElement.setAttribute('fill', "#FFFFFF");
  textElement.setAttribute('opacity', opacity);
  textElement.setAttribute('font-size', round(size/400)+"em");   
  textElement.setAttribute('font-family', "helvetica");
  var time = 4.309843;   
  var textNode = document.createTextNode("RevSys");
  textElement.appendChild(textNode);
  svgElem.appendChild(textElement);
  return svgElem;
}
