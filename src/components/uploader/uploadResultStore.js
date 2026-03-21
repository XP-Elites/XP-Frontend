const UPLOAD_RESULT_STORAGE_KEY = "xp.latestUploadResult";

export function setLatestUploadResult(result) {
  if (!result) {
    return;
  }

  try {
    localStorage.setItem(UPLOAD_RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage failures (quota/private mode)
  }
}

export function clearLatestUploadResult() {
  try {
    localStorage.removeItem(UPLOAD_RESULT_STORAGE_KEY);
  } catch {
    // Ignore storage failures
  }
}

export function getLatestUploadResult() {
  try {
    const raw = localStorage.getItem(UPLOAD_RESULT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}
