main();

function main() {
  /*========== 1. Инициализация WebGL Контекста ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL недоступен");
    return;
  }

  /*========== 2. Определение Геометрии (Однократно) ==========*/
  // --- Объект 1: КУБ (от -0.5 до +0.5 по всем осям) ---
  // Формат одной вершины: [X, Y, Z, R, G, B, A]
  const cubeData = [
    // Передняя грань (Красный)
    -0.5, -0.5,  0.5,  1, 0, 0, 1,   0.5, -0.5,  0.5,  1, 0, 0, 1,   0.5,  0.5,  0.5,  1, 0, 0, 1,
    -0.5, -0.5,  0.5,  1, 0, 0, 1,   0.5,  0.5,  0.5,  1, 0, 0, 1,  -0.5,  0.5,  0.5,  1, 0, 0, 1,
    // Задняя грань (Зеленый)
    -0.5, -0.5, -0.5,  0, 1, 0, 1,  -0.5,  0.5, -0.5,  0, 1, 0, 1,   0.5,  0.5, -0.5,  0, 1, 0, 1,
    -0.5, -0.5, -0.5,  0, 1, 0, 1,   0.5,  0.5, -0.5,  0, 1, 0, 1,   0.5, -0.5, -0.5,  0, 1, 0, 1,
    // Верхняя грань (Синий)
    -0.5,  0.5, -0.5,  0, 0, 1, 1,  -0.5,  0.5,  0.5,  0, 0, 1, 1,   0.5,  0.5,  0.5,  0, 0, 1, 1,
    -0.5,  0.5, -0.5,  0, 0, 1, 1,   0.5,  0.5,  0.5,  0, 0, 1, 1,   0.5,  0.5, -0.5,  0, 0, 1, 1,
    // Нижняя грань (Желтый)
    -0.5, -0.5, -0.5,  1, 1, 0, 1,   0.5, -0.5, -0.5,  1, 1, 0, 1,   0.5, -0.5,  0.5,  1, 1, 0, 1,
    -0.5, -0.5, -0.5,  1, 1, 0, 1,   0.5, -0.5,  0.5,  1, 1, 0, 1,  -0.5, -0.5,  0.5,  1, 1, 0, 1,
    // Правая грань (Пурпурный)
     0.5, -0.5, -0.5,  1, 0, 1, 1,   0.5,  0.5, -0.5,  1, 0, 1, 1,   0.5,  0.5,  0.5,  1, 0, 1, 1,
     0.5, -0.5, -0.5,  1, 0, 1, 1,   0.5,  0.5,  0.5,  1, 0, 1, 1,   0.5, -0.5,  0.5,  1, 0, 1, 1,
    // Левая грань (Голубой)
    -0.5, -0.5, -0.5,  0, 1, 1, 1,  -0.5, -0.5,  0.5,  0, 1, 1, 1,  -0.5,  0.5,  0.5,  0, 1, 1, 1,
    -0.5, -0.5, -0.5,  0, 1, 1, 1,  -0.5,  0.5,  0.5,  0, 1, 1, 1,  -0.5,  0.5, -0.5,  0, 1, 1, 1
  ];

  // --- Объект 2: ВАША ПРИЗМА ИЗ PA1 (Вписывается в 1x1x1) ---
  const solidData = [
    // Передняя крыша (Синий)
    -0.5,  0.0,  0.5,  0, 0, 1, 1,    0.5,  0.0,  0.5,  0, 0, 1, 1,    0.0,  0.5,  0.5,  0, 0, 1, 1,
    // Задняя крыша (Зеленый)
    -0.5,  0.0, -0.5,  0, 1, 0, 1,    0.0,  0.5, -0.5,  0, 1, 0, 1,    0.5,  0.0, -0.5,  0, 1, 0, 1,
    // Правый скат крыши (Красный)
     0.5,  0.0,  0.5,  1, 0, 0, 1,    0.5,  0.0, -0.5,  1, 0, 0, 1,    0.0,  0.5, -0.5,  1, 0, 0, 1,
     0.5,  0.0,  0.5,  1, 0, 0, 1,    0.0,  0.5, -0.5,  1, 0, 0, 1,    0.0,  0.5,  0.5,  1, 0, 0, 1,
    // Левый скат крыши (Желтый)
    -0.5,  0.0,  0.5,  1, 1, 0, 1,    0.0,  0.5,  0.5,  1, 1, 0, 1,    0.0,  0.5, -0.5,  1, 1, 0, 1,
    -0.5,  0.0,  0.5,  1, 1, 0, 1,    0.0,  0.5, -0.5,  1, 1, 0, 1,   -0.5,  0.0, -0.5,  1, 1, 0, 1,
    // Основание (Пурпурный)
    -0.5,  0.0, -0.5,  1, 0, 1, 1,    0.5,  0.0, -0.5,  1, 0, 1, 1,    0.5,  0.0,  0.5,  1, 0, 1, 1,
    -0.5,  0.0, -0.5,  1, 0, 1, 1,    0.5,  0.0,  0.5,  1, 0, 1, 1,   -0.5,  0.0,  0.5,  1, 0, 1, 1
  ];

  const cubeVertexCount = cubeData.length / 7;
  const solidVertexCount = solidData.length / 7;

  // Объединяем оба массива в один VBO
  const allVertices = new Float32Array([...cubeData, ...solidData]);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, allVertices, gl.STATIC_DRAW);

  /*========== 3. Шейдеры (Однократно) ==========*/
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  const program = createProgram(gl, vsSource, fsSource);
  gl.useProgram(program);

  // Локации атрибутов и юниформов
  const aPositionLoc = gl.getAttribLocation(program, "aPosition");
  const aColorLoc = gl.getAttribLocation(program, "aVertexColor");

  const uModelMatrixLoc = gl.getUniformLocation(program, "uModelMatrix");
  const uViewMatrixLoc = gl.getUniformLocation(program, "uViewMatrix");
  const uProjectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

  // Настройка атрибутов (один float = 4 байта, 1 вершина = 7 floats = 28 байт)
  const FSIZE = allVertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 7 * FSIZE, 0);
  gl.enableVertexAttribArray(aPositionLoc);

  gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 7 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(aColorLoc);

  /*========== 4. Состояние системы и Интерактивность ==========*/
  const state = {
    t: 0,
    paused: false,
    ortho: false,
    fovDeg: 45,
    azimuthDeg: 0
  };

  function resize() {
    const displayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    const displayHeight = Math.floor(canvas.clientHeight * window.devicePixelRatio);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }
  window.addEventListener("resize", resize);
  resize();

  // Обработка клавиш (Task E)
  document.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P" || e.key === "з" || e.key === "З") {
      state.paused = !state.paused;
    } else if (e.key === "o" || e.key === "O" || e.key === "щ" || e.key === "Щ") {
      state.ortho = !state.ortho;
    } else if (e.key === "+" || e.key === "=") {
      if (!state.ortho) state.fovDeg = Math.min(100, state.fovDeg + 5);
    } else if (e.key === "-") {
      if (!state.ortho) state.fovDeg = Math.max(20, state.fovDeg - 5);
    } else if (e.key === "ArrowLeft") {
      state.azimuthDeg -= 5;
    } else if (e.key === "ArrowRight") {
      state.azimuthDeg += 5;
    } else if (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К") {
      state.t = 0;
      state.paused = false;
      state.ortho = false;
      state.fovDeg = 45;
      state.azimuthDeg = 0;
    }
  });

  /*========== 5. Цикл Рендеринга ==========*/
  let then = 0;
  let frameCount = 0;
  let lastFpsUpdate = 0;
  let fps = 0;

  function render(now) {
    now *= 0.001; // Перевод в секунды
    const dt = Math.min(now - then, 0.1); // Ограничиваем dt (Task D)
    then = now;

    if (!state.paused) {
      state.t += dt;
    }

    // Расчет FPS за последнюю секунду
    frameCount++;
    if (now - lastFpsUpdate >= 1.0) {
      fps = frameCount;
      frameCount = 0;
      lastFpsUpdate = now;
    }

    // Очистка буферов цвета и глубины
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // --- Построение матрицы View (Камера) ---
    const baseEye = vec3.fromValues(0, 2.5, 7);
    const eye = vec3.create();
    const rotCam = mat4.create();
    mat4.rotateY(rotCam, rotCam, glMatrix.toRadian(state.azimuthDeg));
    vec3.transformMat4(eye, baseEye, rotCam);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(uViewMatrixLoc, false, viewMatrix);

    // --- Построение матрицы Projection ---
    const projMatrix = mat4.create();
    const aspect = canvas.clientWidth / canvas.clientHeight;

    if (!state.ortho) {
      mat4.perspective(projMatrix, glMatrix.toRadian(state.fovDeg), aspect, 0.1, 100.0);
    } else {
      const orthoSize = 3.5;
      mat4.ortho(projMatrix, -orthoSize * aspect, orthoSize * aspect, -orthoSize, orthoSize, 0.1, 100.0);
    }
    gl.uniformMatrix4fv(uProjectionMatrixLoc, false, projMatrix);

    // --- 1. Отрисовка КУБА ---
    const mCube = cubeModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelMatrixLoc, false, mCube);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVertexCount);

    // --- 2. Отрисовка ПРИЗМЫ ---
    const mSolid = solidModelMatrix(state.t);
    gl.uniformMatrix4fv(uModelMatrixLoc, false, mSolid);
    gl.drawArrays(gl.TRIANGLES, cubeVertexCount, solidVertexCount);

    // --- Обновление Статус-Бара ---
    const statusDiv = document.getElementById("status");
    statusDiv.innerHTML = `
      <b>Student ID:</b> 21010321<br>
      <b>Proj:</b> ${state.ortho ? "Orthographic" : "Perspective"}<br>
      <b>FOV:</b> ${state.fovDeg}°<br>
      <b>Time (t):</b> ${state.t.toFixed(1)}s<br>
      <b>FPS:</b> ${fps}
    `;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/*========== Вспомогательные Матричные Функции ==========*/

// Матрица Куба: вращение вокруг нормализованной оси [1, 1, 1] со скоростью 1.2 rad/s
function cubeModelMatrix(t) {
  const m = mat4.create();
  const axis = vec3.fromValues(1, 1, 1);
  vec3.normalize(axis, axis);
  mat4.rotate(m, m, 1.2 * t, axis);
  return m;
}

// Матрица Фигуры: Орбита T=7s, Смещение=2.5, Вращение Y=2.0 rad/s, Пульсация s(t)
function solidModelMatrix(t) {
  const m = mat4.create();
  
  // 1. Вращение по орбите (Период T = 7 с)
  const orbitAngle = (2 * Math.PI * t) / 7.0;
  mat4.rotateY(m, m, orbitAngle);

  // 2. Радиус орбиты 2.5
  mat4.translate(m, m, [2.5, 0, 0]);

  // 3. Вращение вокруг собственной оси Y со скоростью 2.0 rad/s
  mat4.rotateY(m, m, 2.0 * t);

  // 4. Пульсация масштаба: s(t) = 0.65 + 0.15 * sin(2*PI*t / 3)
  const scaleVal = 0.65 + 0.15 * Math.sin((2 * Math.PI * t) / 3.0);
  mat4.scale(m, m, [scaleVal, scaleVal, scaleVal]);

  return m;
}

/*========== Хелперы Шейдеров из PA1 ==========*/
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Ошибка компиляции шейдера:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Ошибка линковки программы:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}
