import { pollAnalysisByUuid, postUploadFormData } from "./uploadClient";
import { validateUploadSize } from "./uploadValidation";

export function parseUploadData(rawData) {
  if (!rawData) {
    return {};
  }

  if (typeof rawData === "string") {
    const trimmed = rawData.trim();

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return { uuid: trimmed };
      }
    }

    return { uuid: trimmed };
  }

  return rawData;
}

export function extractUuid(data) {
  return (
    data?.uuid ||
    data?.UUID ||
    data?.uid ||
    data?.jobId ||
    data?.job_id ||
    data?.data?.uuid ||
    data?.result?.uuid
  );
}

export function isCompletedUpload(data) {
  return Number(data?.status) === 2;
}

export async function resolveUploadResponse(rawData, label = "Upload", options = {}) {
  const data = parseUploadData(rawData);
  const uuid = extractUuid(data);

  if (!uuid) {
    console.error(`${label} payload missing UUID:`, data);
    throw new Error(`${label} succeeded but uuid is missing from response`);
  }

  options.onStatusChange?.({
    uuid,
    status: data?.status || "IN_QUEUE",
  });

  if (isCompletedUpload(data)) {
    return {
      ...data,
      uuid,
    };
  }

  try {
    const polledResult = await pollAnalysisByUuid(uuid, {
      onStatusChange: options.onStatusChange,
    });
    const polledData = parseUploadData(polledResult);

    return {
      ...data,
      ...polledData,
      uuid,
    };
  } catch (error) {
    console.error(
      `Failed to fetch ${label.toLowerCase()} result by UUID:`,
      error.message,
    );
    return {
      ...data,
      uuid,
      status: data?.status || "PENDING",
    };
  }
}

export async function uploadFilesForAnalysis(
  input,
  label = "Upload",
  options = {},
) {
  const files = Array.isArray(input) ? input : validateUploadSize(input);
  validateUploadSize(files);

  if (files.length === 0) {
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.webkitRelativePath || file.name);
  });

  const rawData = await postUploadFormData(formData);
  return resolveUploadResponse(rawData, label, options);
}
