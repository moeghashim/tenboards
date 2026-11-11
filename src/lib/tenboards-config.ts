export interface TenboardsConfig {
  brand: {
    /** CSS #rgb, #rrggbb, rgb() or oklch(). Undefined preserves all built-in themes. */
    color?: string;
    /** Reject colours needing contrast adjustment instead of adjusting them. */
    exact?: boolean;
  };
}
export function defineTenboardsConfig(config: TenboardsConfig): TenboardsConfig {
  return config;
}
