function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("WebGL is not supported by your browser.");
        return;
    }

    // --- Vertex Shader Source ---
    // Matrix multiplication order: Projection * ModelView * Position
    const vsSource = `
        attribute vec4 aPosition;
        attribute vec4 aVertexColor;
        
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        varying lowp vec4 vColor;
        
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
            vColor = aVertexColor;
        }
    `;

    // --- Fragment Shader Source ---
    const fsSource = `
        varying lowp vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `;

    // Helper function to compile shaders
    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create and link shader program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program initialization error: ' + gl.getProgramInfoLog(program));
        return;
    }

    // --- Geometry & Colors (3 Cube Faces) ---
    const positions = [
        // Front face (Blue)
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Right face (Green)
         0.5, -0.5,  0.5,
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,

        // Bottom face (Red)
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,
    ];

    const colors = [
        // Blue face
        ...Array(6).fill([0.0, 0.0, 1.0, 1.0]).flat(),
        // Green face
        ...Array(6).fill([0.0, 1.0, 0.0, 1.0]).flat(),
        // Red face
        ...Array(6).fill([1.0, 0.0, 0.0, 1.0]).flat()
    ];

    // Create and bind Vertex Buffer Object (VBO) for positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create and bind VBO for colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // --- Animation Variables ---
    let cubeRotation = 0.0;
    let then = 0;

    // --- Render Loop Function ---
    function render(now) {
        now *= 0.001; // Convert milliseconds to seconds
        const deltaTime = now - then;
        then = now;

        // Resize Canvas to fit the window
        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear color and depth buffers
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        // Pass position attribute data
        const posAttribLocation = gl.getAttribLocation(program, "aPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttribLocation);

        // Pass color attribute data
        const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttribLocation);

        // --- Matrix Operations using glMatrix ---
        const projMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
        const modelMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');

        // 1. Projection Matrix (Perspective Camera)
        const fieldOfView = (45 * Math.PI) / 180; // Field of view in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

       mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // 2. Model-View Matrix (World Transformation)
        const modelViewMatrix = mat4.create();

        // Translate the object along the Z-axis (into the screen)
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -3.0]);

        // Apply rotations
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);       // Z-axis
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]); // Y-axis

        // Send matrices to uniform variables in vertex shader
        gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);

        // Draw 18 vertices (6 vertices per face * 3 faces)
        gl.drawArrays(gl.TRIANGLES, 0, 18);

        // Update rotation angle
        cubeRotation += deltaTime;

        // Request next frame
        requestAnimationFrame(render);
    }

    // Start render loop
    requestAnimationFrame(render);
}

window.onload = main;
