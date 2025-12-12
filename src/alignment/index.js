export function checkAlignment({ intent, action }) {
  if (!intent || !action) {
    throw new Error("Intent and action are required");
  }

  return {
    aligned: action.purpose === intent.purpose,
    checkedAt: new Date().toISOString(),
  };
}
