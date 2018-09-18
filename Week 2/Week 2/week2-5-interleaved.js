"use strict";
var program;
var canvas;
var gl;
var vBuffer;
var buffer;
var positionView;
var colorView;
var points;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl = WebGLDebugUtils.makeDebugContext(gl);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //Initialize the points
    setupVertices();

    //  Load shaders and initialize attribute buffers
    setupBufferShader();

    render();
};


function setupVertices() {

  var triangleVertices = [
      //( x     y     z )  (r     g    b    a )
      // --------------------------------------
        0.0, 0.5, 0.0, 255, 0, 0, 255, // V0
        0.5, -0.5, 0.0, 0, 250, 6, 255, // V1
       -0.5, -0.5, 0.0, 0, 0, 255, 255  // V2
  ];

  var nbrOfVertices = 3;

  // Calculate how many bytes that are needed for one vertex element
  // that consists of (x,y,z) + (r,g,b,a)
  var vertexSizeInBytes = 3 * Float32Array.BYTES_PER_ELEMENT +
                               4 * Uint8Array.BYTES_PER_ELEMENT;

  var vertexSizeInFloats = vertexSizeInBytes / Float32Array.BYTES_PER_ELEMENT;

  console.log("vertexSizeInBytes: " + vertexSizeInBytes + " Bytes");
  console.log("vertexSizeInFloats: " + vertexSizeInFloats + " Floats");
  // Allocate the buffer
  buffer = new ArrayBuffer(nbrOfVertices * vertexSizeInBytes);

  // Map the buffer to a Float32Array view to access the position
  positionView = new Float32Array(buffer);

  // Map the same buffer to a Uint8Array to access the color
  colorView = new Uint8Array(buffer);

  // Populate the ArrayBuffer from the JavaScript Array
  var positionOffsetInFloats = 0;
  var colorOffsetInBytes = 12;
  var k = 0; // index to JavaScript Array
  for (var i = 0; i < nbrOfVertices; i++) {
      positionView[positionOffsetInFloats] = triangleVertices[k];     // x
      positionView[1 + positionOffsetInFloats] = triangleVertices[k + 1]; // y
      positionView[2 + positionOffsetInFloats] = triangleVertices[k + 2]; // z
      colorView[colorOffsetInBytes] = triangleVertices[k + 3];          // R
      colorView[1 + colorOffsetInBytes] = triangleVertices[k + 4];        // G
      colorView[2 + colorOffsetInBytes] = triangleVertices[k + 5];        // B
      colorView[3 + colorOffsetInBytes] = triangleVertices[k + 6];        // A

      positionOffsetInFloats += vertexSizeInFloats;
      colorOffsetInBytes += vertexSizeInBytes;
      k += 7;
  }

}


function setupBufferShader()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader

    var vBuffer = gl.createBuffer();
    vBuffer.positionSize = 3;
    vBuffer.colorSize = 4;
    vBuffer.numberOfItems = 3;
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    // Describe how the positions are organized in the vertex array
    gl.vertexAttribPointer(vPosition, vBuffer.positionSize, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray( vPosition );



	var vColor = gl.getAttribLocation( program, "vColor" );
  // Describe how colors are organized in the vertex array
  //Note that the normalize flag is set to true.  That means all unsigned value are mapped to [0.0, 1.0]
  //we need that to divide all the color values by 255!
  gl.vertexAttribPointer(vColor, vBuffer.colorSize, gl.UNSIGNED_BYTE, true, 16, 12);
  gl.enableVertexAttribArray( vColor );
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
