const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL não é suportado no seu navegador.");
}
const ext = gl.getExtension("WEBGL_debug_renderer_info");

if (ext) {
  console.log(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
  console.log(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
}

const vertexShaderSource = `
    attribute vec2 aPosition;
    uniform mat3 uTransform;
    void main() {
        vec3 position = uTransform * vec3(aPosition, 1.0);
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

gl.useProgram(program);

const aPosition = gl.getAttribLocation(program, "aPosition");
const uColor = gl.getUniformLocation(program, "uColor");
const uTransform = gl.getUniformLocation(program, "uTransform");

let transform = [1, 0, 0, 0, 1, 0, 0, 0, 1];
let mode = "";

function setTransform() {
  gl.uniformMatrix3fv(uTransform, false, new Float32Array(transform));
}

function resetTransform() {
  transform = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  setTransform();
}

function translate(tx, ty) {
  const translationMatrix = [1, 0, 0, 0, 1, 0, tx, ty, 1];
  const newTransform = multiplyMatrices(transform, translationMatrix);
  if (isWithinBounds(newTransform)) {
    transform = newTransform;
    setTransform();
  }
}

function rotate(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rotationMatrix = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
  const newTransform = multiplyMatrices(transform, rotationMatrix);
  if (isWithinBounds(newTransform)) {
    transform = newTransform;
    setTransform();
  }
}

function scale(sx, sy) {
  const scaleMatrix = [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  const newTransform = multiplyMatrices(transform, scaleMatrix);
  if (isWithinBounds(newTransform)) {
    transform = newTransform;
    setTransform();
  }
}

function mirror() {
  const mirrorMatrix = [-1, 0, 0, 0, -1, 0, 0, 0, 1];
  const newTransform = multiplyMatrices(transform, mirrorMatrix);
  if (isWithinBounds(newTransform)) {
    transform = newTransform;
    setTransform();
  }
}

function multiplyMatrices(a, b) {
  const result = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result[i * 3 + j] = 0;
      for (let k = 0; k < 3; k++) {
        result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
      }
    }
  }
  return result;
}

function isWithinBounds(transform) {
  const points = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
  ];
  for (const point of points) {
    const x = transform[0] * point[0] + transform[3] * point[1] + transform[6];
    const y = transform[1] * point[0] + transform[4] * point[1] + transform[7];
    if (x < -1 || x > 1 || y < -1 || y > 1) {
      return false;
    }
  }
  return true;
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "t":
      mode = "translate";
      break;
    case "r":
      mode = "rotate";
      break;
    case "s":
      mode = "scale";
      break;
    case "m":
      mirror();
      break;
    case "i":
      resetTransform();
      break;
    case "ArrowUp":
      if (mode === "translate") translate(0, 0.1);
      if (mode === "rotate") rotate(Math.PI / 18);
      if (mode === "scale") scale(1.1, 1.1);
      break;
    case "ArrowDown":
      if (mode === "translate") translate(0, -0.1);
      if (mode === "rotate") rotate(-Math.PI / 18);
      if (mode === "scale") scale(0.9, 0.9);
      break;
    case "ArrowLeft":
      if (mode === "translate") translate(-0.1, 0);
      break;
    case "ArrowRight":
      if (mode === "translate") translate(0.1, 0);
      break;
  }
  drawScene();
});

function drawScene() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawPart([0.0, 0.5, -0.2, -0.5, 0.2, -0.5], [0.8, 0.8, 0.8, 1.0]);

  drawPart([0.0, 0.8, -0.1, 0.5, 0.1, 0.5], [1.0, 0.0, 0.0, 1.0]);

  drawPart([-0.2, -0.5, -0.4, -0.7, -0.2, -0.7], [0.0, 0.0, 1.0, 1.0]);

  drawPart([0.2, -0.5, 0.4, -0.7, 0.2, -0.7], [0.0, 0.0, 1.0, 1.0]);

  drawPart([-0.1, -0.7, 0.1, -0.7, 0.0, -0.9], [1.0, 0.5, 0.0, 1.0]);
}

function drawPart(vertices, color) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.uniform4f(uColor, ...color);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

resetTransform();
drawScene();
