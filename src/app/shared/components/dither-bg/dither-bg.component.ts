import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  viewChild,
} from '@angular/core';

// Вершинный шейдер — просто прямоугольник на весь канвас
const VS_SRC = `#version 300 es
precision mediump float;
layout(location=0) in vec4 p;
void main(){gl_Position=p;}`;

// Фрагментный шейдер: simplex-шум + Bayer-дизеринг (готовый сниппет пользователя)
const FS_SRC = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_scale;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv) {
  ivec2 pos = ivec2(fract(uv / 8.) * 8.);
  return float(bayer8x8[pos.y * 8 + pos.x]) / 64.0;
}

void main() {
  float t = .5 * u_time;

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;

  vec2 shapeUV = canvasPixelizedUV / u_resolution;
  shapeUV *= u_resolution;
  shapeUV /= u_pixelRatio;
  shapeUV /= u_scale;
  shapeUV += .5;

  shapeUV *= .001;
  float shape = 0.5 + 0.5 * getSimplexNoise(shapeUV, t);
  // Порог сдвинут вверх от исходных (0.3, 0.9): чёрный преобладает,
  // красный виден только в пиках шума (0.62 было перебором — красный исчезал)
  shape = smoothstep(0.48, 0.95, shape);

  float dithering = getBayerValue(pxSizeUV) - .5;
  float res = step(.5, shape + dithering);

  vec3 color = u_colorFront.rgb * u_colorFront.a * res;
  float opacity = u_colorFront.a * res;
  color += u_colorBack.rgb * u_colorBack.a * (1. - opacity);
  opacity += u_colorBack.a * (1. - opacity);

  fragColor = vec4(color, opacity);
}`;

// Анимированный дизер-фон (WebGL2) для тёмных секций: красный simplex-шум
// на цвете --color-dark. Кладётся в секцию с relative overflow-hidden,
// контент поверх — relative z-10. Без WebGL2 секция остаётся обычным bg-dark.
@Component({
  selector: 'app-dither-bg',
  standalone: true,
  host: { class: 'absolute inset-0 pointer-events-none' },
  templateUrl: './dither-bg.component.html',
})
export class DitherBgComponent implements OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cnv');

  private gl?: WebGL2RenderingContext;
  private rafId?: number;
  private observer?: IntersectionObserver;
  private visible = false;

  constructor() {
    // afterNextRender выполняется только в браузере — SSR-safe
    afterNextRender(() => this.init());
  }

  private init() {
    const canvas = this.canvasRef().nativeElement;
    const gl = canvas.getContext('webgl2');
    if (!gl) return; // без WebGL2 фон просто остаётся статичным bg-dark
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS_SRC));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS_SRC));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, -1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const loc = (name: string) => gl.getUniformLocation(prog, name);
    const uResolution = loc('u_resolution');
    const uTime = loc('u_time');
    gl.uniform1f(loc('u_pixelRatio'), devicePixelRatio);
    gl.uniform1f(loc('u_pxSize'), 1);
    gl.uniform1f(loc('u_scale'), 1.8);
    // #111111 (--color-dark) и ~#ab0809 (primary) — значения из исходного сниппета
    gl.uniform4fv(loc('u_colorBack'), new Float32Array([0.0667, 0.0667, 0.0667, 1]));
    gl.uniform4fv(loc('u_colorFront'), new Float32Array([0.6706, 0.0314, 0.0353, 1]));

    const t0 = Date.now();
    const drawFrame = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (Date.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // reduced-motion: один статичный кадр вместо анимации
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawFrame();
      return;
    }

    // rAF-цикл крутится только пока секция видна — иначе зря жжём GPU/батарею
    const loop = () => {
      drawFrame();
      this.rafId = this.visible ? requestAnimationFrame(loop) : undefined;
    };
    this.observer = new IntersectionObserver((entries) => {
      const wasVisible = this.visible;
      this.visible = entries[0].isIntersecting;
      if (this.visible && !wasVisible) loop();
    });
    this.observer.observe(canvas);
  }

  ngOnDestroy() {
    this.visible = false;
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    this.observer?.disconnect();
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
