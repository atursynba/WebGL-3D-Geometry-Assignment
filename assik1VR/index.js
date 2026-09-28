// Student ID variant parameters (ID ending in 21)
// Second-to-last digit 2: 2 mod 4 = 2 -> (ox, oy) = (+0.15, -0.15) [Bottom & Right faces visible]
// Last digit 1: Assigned 3D Solid = Triangular Prism (24 vertices)
const STUDENT_ID = "21"; 
const OFFSET_X = 0.15;
const OFFSET_Y = -0.15;

/*========== Shader Sources (Embedded via Template Literals) ==========*/

const vsSource = `
  attribute vec3 aPosition;
  attribute vec4 aVertexColor;
  
  varying lowp vec4 vColor;

  void main() {
    gl_Position = vec4(aPosition, 1.0);
    gl_PointSize = 8.0;
    vColor = aVertexColor;
  }
`;

const fsSource = `
  precision mediump float;
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

/*========== Main Application Entry Point ==========*/

window.addEventListener("DOMContentLoaded", () => {
  /*========== 1. WebGL Context Setup ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) { 
    console.error("WebGL 1.0 context is unavailable."); 
    return; 
  }

  /*========== 2. Geometry & Data Processing ==========*/
  const rawCubePositions = createCubePositions(); 
  const rawPrismPositions = createTriangularPrismPositions(); 

  // Apply 2.5D projection offset
  const cubePositions = applyDepthOffset(rawCubePositions, OFFSET_X, OFFSET_Y);
  const prismPositions = applyDepthOffset(rawPrismPositions, OFFSET_X, OFFSET_Y);

  const allPositions = new Float32Array([...cubePositions, ...prismPositions]);

  const cubeColors = createCubeColors(cubePositions.length / 3);
  const prismColors = createPrismColors(prismPositions.length / 3);
  const allColors = new Float32Array([...cubeColors, ...prismColors]);

  console.assert(
    allColors.length === (allPositions.length / 3) * 4,
    "Color array must supply exactly 4 float values (RGBA) per vertex!"
  );

  const cubeVertexCount = cubePositions.length / 3;
  const prismVertexCount = prismPositions.length / 3;

  /*========== 3. Buffer Allocation ==========*/
  const buffers = initBuffers(gl, allPositions, allColors);

  /*========== 4. Shader Compilation & Attribute Linking ==========*/
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const aPositionLoc = gl.getAttribLocation(program, "aPosition");
  const aVertexColorLoc = gl.getAttribLocation(program, "aVertexColor");

  // Position Attribute Pointer (Size = 3 for 3D coordinates: x, y, z)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPositionLoc);

  // Color Attribute Pointer (Size = 4 for RGBA components)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(aVertexColorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexColorLoc);

  /*========== 5. Render State & Interactive Handler ==========*/
  const state = {
    mode: gl.TRIANGLES,
    modeName: "TRIANGLES",
    depth: true,
    cubeFirst: true
  };

  const statusLabel = document.querySelector("#status");

  function updateStatus() {
    statusLabel.textContent = `ID: ${STUDENT_ID} | Mode: ${state.modeName} | Depth: ${state.depth ? "ON" : "OFF"} | Order: ${state.cubeFirst ? "Cube First" : "Solid First"}`;
  }

  function render() {
    gl.clearColor(0.12, 0.12, 0.14, 1.0);
    
    // Depth Testing Configuration (Chapter 3)
    if (state.depth) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    // Clear Color and Depth Buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    // Render Geometry Batches
    if (state.cubeFirst) {
      gl.drawArrays(state.mode, 0, cubeVertexCount);
      gl.drawArrays(state.mode, cubeVertexCount, prismVertexCount);
    } else {
      gl.drawArrays(state.mode, cubeVertexCount, prismVertexCount);
      gl.drawArrays(state.mode, 0, cubeVertexCount);
    }

    updateStatus();
  }

  // Keyboard Navigation Controls
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "1": state.mode = gl.TRIANGLES; state.modeName = "TRIANGLES"; break;
      case "2": state.mode = gl.LINE_LOOP; state.modeName = "LINE_LOOP"; break;
      case "3": state.mode = gl.LINES; state.modeName = "LINES"; break;
      case "4": state.mode = gl.LINE_STRIP; state.modeName = "LINE_STRIP"; break;
      case "5": state.mode = gl.POINTS; state.modeName = "POINTS"; break;
      case "6": state.mode = gl.TRIANGLE_STRIP; state.modeName = "TRIANGLE_STRIP"; break;
      case "d": case "D": state.depth = !state.depth; break;
      case "s": case "S": state.cubeFirst = !state.cubeFirst; break;
      default: return;
    }
    render();
  });

  render();
});

/*========== Helper Functions ==========*/

function applyDepthOffset(positions, ox, oy) {
  const result = [];
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const xDraw = x + ox * (z + 0.5);
    const yDraw = y + oy * (z + 0.5);

    result.push(xDraw, yDraw, z);
  }
  return result;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function initBuffers(gl, positions, colors) {
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const colBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  return { position: posBuffer, color: colBuffer };
}

/*========== Geometry Generators ==========*/

function createCubePositions() {
  const x1 = -0.75, x2 = -0.25;
  const y1 = -0.25, y2 = 0.25;
  const z1 = -0.5,  z2 = 0.5;

  return [
    // Front face
    x1,y1,z1,  x2,y1,z1,  x2,y2,z1,   x1,y1,z1,  x1,y2,z1,  x2,y2,z1,
    // Back face
    x1,y1,z2,  x2,y1,z2,  x2,y2,z2,   x1,y1,z2,  x1,y2,z2,  x2,y2,z2,
    // Top face
    x1,y2,z1,  x2,y2,z1,  x2,y2,z2,   x1,y2,z1,  x1,y2,z2,  x2,y2,z2,
    // Bottom face
    x1,y1,z1,  x2,y1,z1,  x2,y1,z2,   x1,y1,z1,  x1,y1,z2,  x2,y1,z2,
    // Left face
    x1,y1,z1,  x1,y2,z1,  x1,y2,z2,   x1,y1,z1,  x1,y1,z2,  x1,y2,z2,
    // Right face
    x2,y1,z1,  x2,y2,z1,  x2,y2,z2,   x2,y1,z1,  x2,y1,z2,  x2,y2,z2,
  ];
}

function createTriangularPrismPositions() {
  const A = [0.25, -0.25];
  const B = [0.75, -0.25];
  const C = [0.5,   0.35];
  const z1 = -0.5, z2 = 0.5;

  return [
    // Front base
    ...A, z1,  ...B, z1,  ...C, z1,
    // Back base
    ...A, z2,  ...B, z2,  ...C, z2,
    // Bottom face
    ...A, z1,  ...B, z1,  ...B, z2,   ...A, z1,  ...A, z2,  ...B, z2,
    // Right sloped face
    ...B, z1,  ...C, z1,  ...C, z2,   ...B, z1,  ...B, z2,  ...C, z2,
    // Left sloped face
    ...C, z1,  ...A, z1,  ...A, z2,   ...C, z1,  ...C, z2,  ...A, z2
  ];
}

function createCubeColors(vertexCount) {
  const colors = [];
  for (let face = 0; face < 6; face++) {
    if (face === 0) {
      // Gradient interpolated face
      colors.push(
        1,0,0,1,  0,1,0,1,  0,0,1,1,
        1,0,0,1,  1,1,0,1,  0,0,1,1
      );
    } else {
      const palette = [
        [0.1, 0.7, 0.3, 1],
        [0.2, 0.4, 0.9, 1],
        [0.9, 0.8, 0.1, 1],
        [0.8, 0.2, 0.6, 1],
        [0.2, 0.8, 0.8, 1]
      ];
      const c = palette[face - 1];
      for (let v = 0; v < 6; v++) colors.push(...c);
    }
  }
  return colors;
}

function createPrismColors(vertexCount) {
  const colors = [];
  
  // Front base gradient
  colors.push(1,0,0,1,  0,1,0,1,  0,0,1,1);

  // Back base solid color
  const c2 = [0.9, 0.5, 0.1, 1];
  for (let v = 0; v < 3; v++) colors.push(...c2);

  const sidePalette = [
    [0.1, 0.8, 0.7, 1],
    [0.7, 0.2, 0.8, 1],
    [0.8, 0.8, 0.2, 1]
  ];

  for (let face = 0; face < 3; face++) {
    const c = sidePalette[face];
    for (let v = 0; v < 6; v++) colors.push(...c);
  }

  return colors;
}