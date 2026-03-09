import axios from "axios";

const UPLOAD_URL = "https://httpbin.org/post";
const UPLOAD_TIMEOUT_MS = 30000;

export async function postUploadFormData(formData) {
  return axios.post(UPLOAD_URL, formData, {
    timeout: UPLOAD_TIMEOUT_MS,
  });
}

export async function postUploadJson(payload) {
  return axios.post(UPLOAD_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: UPLOAD_TIMEOUT_MS,
  });
}
