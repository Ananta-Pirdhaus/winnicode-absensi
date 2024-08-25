import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../../images/auth-idle.svg";
import AuthFace from "../../images/auth-face.svg";

const FaceRecognitionModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [localUserStream, setLocalUserStream] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setIsLoading(false);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const getLocalUserVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        console.log(
          "Video dimensions:",
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
      };
      setLocalUserStream(stream);
    };
    getLocalUserVideo();
  }, []);

  useEffect(() => {
    const scanFace = async () => {
      if (!localUserStream || !videoRef.current || !canvasRef.current) return;

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

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors); // Assume labeledFaceDescriptors are loaded

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      if (results.length > 0 && results[0].label === "expectedLabel") {
        setLoginResult("SUCCESS");
        // Update attendance status here
      } else {
        setLoginResult("FAILED");
      }
    };

    const intervalId = setInterval(scanFace, 1000 / 15);

    return () => clearInterval(intervalId);
  }, [localUserStream]);

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
            <p>Face recognized successfully! Attendance marked as present.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognitionModal;
