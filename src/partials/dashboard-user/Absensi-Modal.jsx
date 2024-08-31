import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../../images/auth-idle.svg";
import AuthFace from "../../images/auth-face.svg";
import { axiosInstance } from "../../components/axios";

const getLabeledFaceDescriptors = async (imageSrc, studentName) => {
  try {
    const img = await faceapi.fetchImage(imageSrc);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detections) return [];
    return [
      new faceapi.LabeledFaceDescriptors(studentName, [detections.descriptor]),
    ];
  } catch (error) {
    console.error("Error fetching face descriptors:", error);
    return [];
  }
};

const AbsensiModal = ({ isOpen, studentName, studentImageSrc, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [localUserStream, setLocalUserStream] = useState(null);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const [recognizedName, setRecognizedName] = useState(null);
  const [isRecognitionStopped, setIsRecognitionStopped] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  let intervalId = useRef(null);

  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      const descriptors = await getLabeledFaceDescriptors(
        studentImageSrc,
        studentName
      );
      if (descriptors.length === 0) {
        console.error("No face descriptors found for the student.");
        return;
      }
      setLabeledFaceDescriptors(descriptors);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading face-api.js models:", error);
      setIsLoading(false);
    }
  };

  const getLocalUserVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
      setLocalUserStream(stream);
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  const scanFace = async () => {
    if (
      !localUserStream ||
      !videoRef.current ||
      !canvasRef.current ||
      labeledFaceDescriptors.length === 0 ||
      isRecognitionStopped
    )
      return;

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    if (videoWidth === 0 || videoHeight === 0) {
      console.error("Video dimensions are invalid:", {
        width: videoWidth,
        height: videoHeight,
      });
      return;
    }

    faceapi.matchDimensions(canvasRef.current, videoRef.current);

    const detections = await faceapi
      .detectAllFaces(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, {
      width: videoWidth,
      height: videoHeight,
    });

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (results.length > 0 && results[0].label === studentName) {
      setLoginResult("SUCCESS");
      setRecognizedName(studentName);
      setIsRecognitionStopped(true);
      clearInterval(intervalId.current);

      // Send request to update attendance status
      try {
        await axiosInstance.post("/absensi", {
          studentName: recognizedName || studentName,
          status: "Hadir",
        });
        console.log("Attendance status updated to 'Hadir'");
      } catch (error) {
        console.error("Error updating attendance status:", error);
      }
    } else {
      setLoginResult("FAILED");
    }
  };

  useEffect(() => {
    if (localUserStream) {
      intervalId.current = setInterval(scanFace, 1000 / 15);
      return () => clearInterval(intervalId.current);
    }
  }, [localUserStream]);

  useEffect(() => {
    if (isOpen) {
      loadModels();
      getLocalUserVideo();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (localUserStream) {
        localUserStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localUserStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full rounded-lg"
            style={{ display: localUserStream ? "block" : "none" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 rounded-lg"
            style={{ display: localUserStream ? "block" : "none" }}
          />
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-4">
            <img alt="loading models" src={AuthIdle} className="w-48 h-48" />
            <p className="text-gray-700 mt-4">
              Loading face recognition models...
            </p>
          </div>
        )}
        {!isLoading && loginResult === "FAILED" && (
          <div className="text-center text-red-600 mt-4">
            <img
              alt="face recognition failed"
              src={AuthFace}
              className="w-24 h-24 mx-auto"
            />
            <p>Face recognition failed. Please try again.</p>
          </div>
        )}
        {!isLoading && loginResult === "SUCCESS" && (
          <div className="text-center text-green-600 mt-4">
            <p>Face recognized successfully!</p>
            <p>Welcome, {recognizedName}!</p>
          </div>
        )}
        {!isLoading && loginResult === "PENDING" && (
          <div className="text-center text-gray-700 mt-4">
            <p>Please wait, scanning...</p>
          </div>
        )}
        <button
          onClick={() => {
            loadModels();
            getLocalUserVideo();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Preview Absensi
        </button>
      </div>
    </div>
  );
};

export default AbsensiModal;
