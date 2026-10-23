// A visibly dated demo snapshot, independent of module clocks and runtime timezone.
// Local calendar fields intentionally match on server and client; no live date is inferred.
export const demoDayLabel = "October 23, 2026";
export const createDemoDay = () => new Date(2026, 9, 23, 12);
export const createDemoMonth = () => new Date(2026, 9, 1, 12);
