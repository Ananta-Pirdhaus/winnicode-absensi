import * as faceapi from "face-api.js";

export const setupFaceApi = async () => {
  // Load face-api.js models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("../../public"),
    faceapi.nets.faceLandmark68Net.loadFromUri("../../public"),
    faceapi.nets.faceRecognitionNet.loadFromUri("../../public"),
  ]);
};
