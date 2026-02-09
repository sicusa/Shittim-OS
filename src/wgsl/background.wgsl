@link fn getTextureSize() -> vec2<f32>;
@link fn getZoom() -> f32;
@link fn getTime() -> f32;

const HALF = vec2(0.5);

const BLUE = vec3(0.63529411764706, 0.85490196078431, 0.94509803921569);
const DEEP_BLUE = vec3(0.39607843137255, 0.8156862745098, 0.96078431372549);
const RED = vec3(0.95686274509804, 0.86274509803922, 0.88235294117647);

const GRID_COLOR = vec3(1.0);
const GRID_SPACE = 230.0;
const GRID_WIDTH = 1.0;
const DOT_RADIUS = 1.0;

fn mod2(x: vec2<f32>, y: f32) -> vec2<f32> {
  return x - y * floor(x / y);
}

fn dottedField(coord: vec2<f32>, space: f32) -> vec2<f32> {
  let halfSpace = space / 2;
  let cm = mod2(coord + halfSpace, space);
  return halfSpace - cm;
}

fn grid(coord: vec2<f32>, space: f32, width: f32) -> f32 {
  let pos = coord;
  let size = vec2(width);

  let m1 = mod2(pos - size, space);
  let m2 = mod2(pos + size, space);
  let m= m2 - m1;

  let g = min(m.x, m.y);
  return clamp(1.0 - g, 0.0, 1.0);
}

fn rand(n: f32) -> f32 {
  return fract(abs(sin(n * 55.753) * 367.34));
}

fn randv(n: vec2<f32>) -> f32 {
  return rand(dot(n, vec2(2.46, -1.21)));
}

fn cycle(n: f32) -> f32 {
  return cos(fract(n) * 2.0 * 3.141592653) * 0.5 + 0.5;
}

fn triangles(coord: vec2<f32>, zoom: f32, time: f32) -> f32 {
  let a = radians(60.0);

  let c = coord * vec2(sin(a), 1.0);
  let cf =
    (c + vec2(c.y, 0.0) * cos(a)) / zoom +
    vec2(floor(4.0 * (c.x - c.y * cos(a)) / zoom), 0.0);

  return cycle(
    randv(floor(cf * 4.0)) * 0.2 +
    randv(floor(cf * 2.0)) * 0.3 +
    randv(floor(cf)) * 0.5 + time
  );
}

fn main(uv: vec2<f32>) -> vec4<f32> {
  let size = getTextureSize();
  let zoom = getZoom();
  let time = getTime();
  let coord = uv * size / zoom;

  // grids

  let df = length(dottedField(coord, GRID_SPACE));
  let df_small = length(dottedField(coord, GRID_SPACE / 8));

  let ga = grid(coord, GRID_SPACE, GRID_WIDTH) * step(23.0, df);
  let gb = grid(coord, GRID_SPACE, GRID_WIDTH * 2) * (1.0 - step(15.0, df));

  let coord2 = coord + GRID_SPACE / 2;
  let df2 = length(dottedField(coord2, GRID_SPACE));
  let ga2 = grid(coord2, GRID_SPACE, GRID_WIDTH) * step(23.0, df2);
  let gb2 = grid(coord2, GRID_SPACE, GRID_WIDTH * 3) * (1.0 - step(15.0, df2));

  let g1 =
    max(0, ga - 0.6) + max(0, gb - 0.4) +
    max(0, 0.8 - ga - gb - ga2 - gb2 - step(DOT_RADIUS, df_small));
  let g2 =
    max(0, ga2 - 0.6) + max(0, gb2 - 0.4);
  
  // triangles

  let tri = triangles(coord, 700.0, time) * 0.2;

  // final composition

  let bkgFade = min(1.0, uv.y * abs(uv.x - 0.5) * 1.5) + uv.y * uv.y * 0.4;
  let bkgRGB = mix(BLUE, RED, bkgFade);
  let rgb =
    mix(mix(bkgRGB, GRID_COLOR, g1 + tri), DEEP_BLUE, 0.6 * g2 * (1.0 - bkgFade));

  return vec4(rgb.x, rgb.y, rgb.z, 1.0);
};