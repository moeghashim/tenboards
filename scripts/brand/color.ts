/** OKLab matrices from Björn Ottosson's reference transform; D65 sRGB. */
export type RGB = [number, number, number];
export type LCH = [number, number, number];
const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
export function toLch(rgb: RGB): LCH {
  const [r, g, b] = rgb.map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(a, bb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    c,
    c < 1e-7 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  ];
}
export function toRgb([L, C, H]: LCH): RGB {
  const a = C * Math.cos((H * Math.PI) / 180),
    b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gamma) as RGB;
}
export function gamut(lch: LCH): LCH {
  const valid = (c: number) => toRgb([lch[0], c, lch[2]]).every((v) => v >= -1e-7 && v <= 1.0000001);
  if (valid(lch[1])) return lch;
  let low = 0,
    high = Math.min(lch[1], 1);
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    if (valid(mid)) low = mid;
    else high = mid;
  }
  return [lch[0], low, lch[2]];
}
export function contrast(a: RGB, b: RGB): number {
  const lum = (rgb: RGB) => rgb.map(linear).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export const css = (lch: LCH) => `oklch(${lch[0].toFixed(8)} ${lch[1].toFixed(8)} ${lch[2].toFixed(6)})`;
export function parseColor(input: string): LCH {
  const invalid = () =>
    new Error(
      `Invalid colour ${JSON.stringify(input)}. Use #rgb, #rrggbb, rgb(255 128 0) or oklch(0.7 0.15 200); opaque colours only.`,
    );
  const value = input.trim();
  if (/^#[\da-f]{3}([\da-f]{3})?$/i.test(value)) {
    const hex =
      value.length === 4
        ? value
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
        : value.slice(1);
    return toLch([0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255) as RGB);
  }
  const match = value.match(/^(rgb|oklch)\(([^()]+)\)$/i);
  if (!match) throw invalid();
  const parts = match[2].trim().split(match[2].includes(",") ? /\s*,\s*/ : /\s+/);
  if (parts.length !== 3 || parts.some((p) => !/^[-+]?(?:\d*\.)?\d+(?:%|deg)?$/.test(p))) throw invalid();
  const nums = parts.map(Number.parseFloat);
  if (nums.some((value) => !Number.isFinite(value))) throw invalid();
  if (match[1].toLowerCase() === "rgb") {
    if (
      parts.some((p) => p.endsWith("deg")) ||
      (parts.some((p) => p.endsWith("%")) && !parts.every((p) => p.endsWith("%")))
    )
      throw invalid();
    const rgb = nums.map((v, i) => v / (parts[i].endsWith("%") ? 100 : 255)) as RGB;
    if (rgb.some((v) => v < 0 || v > 1)) throw invalid();
    return toLch(rgb);
  }
  if (parts[0].endsWith("deg") || parts[1].endsWith("deg") || parts[2].endsWith("%")) throw invalid();
  const l = nums[0] / (parts[0].endsWith("%") ? 100 : 1),
    c = nums[1] * (parts[1].endsWith("%") ? 0.004 : 1);
  if (l < 0 || l > 1 || c < 0) throw invalid();
  return [l, c, ((nums[2] % 360) + 360) % 360];
}
