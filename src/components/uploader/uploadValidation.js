export const MAX_UPLOAD_SIZE_MB = 50;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export function normalizeFiles(input) {
  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input.length === "number") {
    return Array.from(input);
  }

  return [input];
}

export function getTotalUploadSize(input) {
  return normalizeFiles(input).reduce((total, file) => total + file.size, 0);
}

export function validateUploadSize(input) {
  const files = normalizeFiles(input);

  if (getTotalUploadSize(files) > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(`Upload exceeds the ${MAX_UPLOAD_SIZE_MB} MB limit`);
  }

  return files;
}
