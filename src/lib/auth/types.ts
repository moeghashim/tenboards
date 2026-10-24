export type AuthUser = { id: string; name: string; email: string };
export type AuthState =
  | { mode: "demo"; user: null; providers: { google: false; github: false } }
  | { mode: "auth"; user: AuthUser | null; providers: { google: boolean; github: boolean } };
