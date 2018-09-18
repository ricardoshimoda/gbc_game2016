"use strict";
var program;
var canvas;
var gl;
var vBuffer
var points;
//decrease the nhnumber to 5
var NumPoints = 500000;

// First, initialize the corners of our gasket with three points.
var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if ( !gl ) { alert( "WebGL isn't available" ); }

    setupVertices();
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    setupBufferShader();
    render();
};


function setupVertices()
{
  // Specify a starting point p for our iterations
  // p must lie inside any set of three vertices

  var u = add(vertices[0], vertices[1]);
  var v = add(vertices[0], vertices[2]);
  var p = scale(0.5, add(u, v));

  // And, add our initial point into our array of points

  points = [p];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex

  for (var i = 0; points.length < NumPoints; ++i) {
      var j = Math.floor(Math.random() * 3);
      p = add(points[i], vertices[j]);
      p = scale(0.5, p);
      points.push(p);
  }
}

function setupBufferShader()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}
