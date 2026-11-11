import { contrast, css, gamut, type LCH, parseColor, type RGB, toRgb } from "./color.ts";

export function derive(input: string, exact = false) {
  const original = parseColor(input);
  const reports: string[] = [`Input: ${input} (${css(original)})`];
  const modes: Record<string, Record<string, string>> = {};
  for (const mode of ["light", "dark"]) {
    const dark = mode === "dark";
    const surfaces = (dark ? ["#111318", "#191d25", "#252b36"] : ["#f8f9fb", "#ffffff", "#f0f2f5"]).map((v) =>
      toRgb(parseColor(v)),
    );
    function nearest(start: LCH, passes: (rgb: RGB) => boolean): LCH {
      const initial = gamut(start);
      if (passes(toRgb(initial))) return initial;
      // Search both lightness directions, with a 0.0001 precision, before gamut mapping.
      for (let step = 1; step <= 10000; step++)
        for (const direction of [-1, 1]) {
          const L = start[0] + (direction * step) / 10000;
          if (L < 0 || L > 1) continue;
          const candidate = gamut([L, start[1], start[2]]);
          if (passes(toRgb(candidate))) return candidate;
        }
      throw new Error("No contrast-safe colour found");
    }
    const white: RGB = [1, 1, 1],
      black = toRgb(parseColor("#111318"));
    // Choose the label against the input before deriving a deeper dark-mode fill.
    const choices = [white, black].map((fg) => ({ fg, fill: nearest(original, (rgb) => contrast(rgb, fg) >= 4.6) }));
    choices.sort((a, b) => Math.abs(a.fill[0] - original[0]) - Math.abs(b.fill[0] - original[0]));
    const { fg } = choices[0];
    const fillStart: LCH = dark && fg === white ? [Math.min(original[0], 0.55), original[1], original[2]] : original;
    const fill = nearest(fillStart, (rgb) => contrast(rgb, fg) >= 4.6);
    const accent = nearest(dark ? [Math.max(original[0], 0.75), original[1], original[2]] : original, (rgb) =>
      surfaces.every((bg) => contrast(rgb, bg) >= 4.6),
    );
    const hover = nearest([Math.max(0, fill[0] - 0.025), fill[1], fill[2]], (rgb) => contrast(rgb, fg) >= 4.6);
    const top = nearest([Math.min(1, fill[0] + 0.012), fill[1], fill[2]], (rgb) => contrast(rgb, fg) >= 4.6);
    const roles = {
      primary: fill,
      "action-accent": accent,
      ring: accent,
      "chart-1": accent,
      "primary-hover": hover,
      "primary-top": top,
    };
    const targets: Record<string, LCH> = {
      primary: fillStart,
      "action-accent": dark ? [Math.max(original[0], 0.75), original[1], original[2]] : original,
      ring: dark ? [Math.max(original[0], 0.75), original[1], original[2]] : original,
      "chart-1": dark ? [Math.max(original[0], 0.75), original[1], original[2]] : original,
      "primary-hover": [Math.max(0, fill[0] - 0.025), fill[1], fill[2]],
      "primary-top": [Math.min(1, fill[0] + 0.012), fill[1], fill[2]],
    };
    for (const [role, value] of Object.entries(roles)) {
      const ratio = role.startsWith("primary")
        ? contrast(toRgb(value), fg)
        : Math.min(...surfaces.map((bg) => contrast(toRgb(value), bg)));
      const deltaL = value[0] - original[0],
        deltaC = value[1] - original[1];
      const adjusted = Math.abs(deltaL) > 0.00001 || Math.abs(deltaC) > 0.00001;
      const target = targets[role];
      // Report the decisive correction, then intentional derivation, then gamut-only changes.
      const pair = role.startsWith("primary")
        ? { name: `foreground ${fg === white ? "#ffffff" : "#111318"}`, rgb: fg }
        : surfaces
            .map((rgb, index) => ({ name: ["bg", "surface", "surface-raised"][index], rgb }))
            .sort((a, b) => contrast(toRgb(gamut(target)), a.rgb) - contrast(toRgb(gamut(target)), b.rgb))[0];
      const before = contrast(toRgb(gamut(target)), pair.rgb);
      const after = contrast(toRgb(value), pair.rgb);
      let reason = "sRGB gamut clamp";
      if (Math.abs(value[0] - target[0]) > 0.00001)
        reason = `contrast vs ${pair.name} ${before.toFixed(2)}→${after.toFixed(2)}`;
      else if (role === "primary-hover" || role === "primary-top") reason = "hover derivation";
      else if (Math.abs(target[0] - original[0]) > 0.00001) reason = "dark-mode derivation";
      reports.push(
        `${mode} ${role}: ${css(value)}; ${ratio.toFixed(2)}:1; ${adjusted ? `adjusted ΔL=${deltaL.toFixed(5)} ΔC=${deltaC.toFixed(5)} (${reason})` : "unchanged"}`,
      );
      const corrected = Math.abs(value[0] - target[0]) > 0.00001 || Math.abs(value[1] - target[1]) > 0.00001;
      if (exact && corrected)
        throw new Error(
          `--exact: ${mode} ${role}/${role.startsWith("primary") ? "label" : "surfaces"} needs adjustment. Nearest passing value: ${css(value)} (${ratio.toFixed(2)}:1). Omit --exact to auto-adjust.`,
        );
    }
    reports.push(`${mode} primary-foreground: ${fg === white ? "#ffffff" : "#111318"}`);
    modes[mode] = {
      ...Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, css(v)])),
      "primary-foreground": fg === white ? "#ffffff" : "#111318",
      "filter-accent": css(accent),
      "filter-edge": css(accent),
    };
  }
  const series = { success: ["#166534", "#86efac"], warning: ["#854d0e", "#fde68a"], muted: ["#515b6b", "#b0bacb"] };
  for (const [name, colours] of Object.entries(series)) {
    if (
      colours.some((colour) => {
        const distance = Math.abs(parseColor(colour)[2] - original[2]);
        return Math.min(distance, 360 - distance) <= 25;
      })
    )
      reports.push(
        `Chart hue overlaps the ${name} series: retain existing dash/marker encodings and labels; semantic colours are unchanged.`,
      );
  }
  return { modes, reports };
}
