"use strict";
var program;
var canvas;
var gl;
var vBuffer
var points;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) {
        alert("WebGL isn't available");
    }

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
  // First, initialize the circle.

  var pi = 3.14159;
  var x = 2 * pi / 100;
  var y = 2 * pi / 100;
  var r = 0.5;

  points = [vec2(0.0, 0.0)]; //establish origin

  for (var i = 0.0; i < 100; i=i+.001) {
    points.push(vec2(r * Math.cos(x * i), r * Math.sin(y * i)));
    points.push(vec2(r * Math.cos(x * (i + 1)), r * Math.sin(y * (i + 1))));
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
