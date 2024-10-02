'use client';
import React, { useState, useEffect, useRef } from 'react';

const VideoModal = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility
  const modalRef = useRef<HTMLDivElement>(null); // Reference to the modal
  const videoRef = useRef(null); // Reference to the video

  // Function to close modal when clicking outside the video
  const handleClickOutside = (event:MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Trigger button to show modal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Open Video Modal
      </button>

      {/* Modal container */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-2xl shadow-lg" ref={modalRef}>
            <video
              ref={videoRef}
              suppressHydrationWarning={true}
              src={
                "https://usingmethodvideo.s3.ap-northeast-2.amazonaws.com/%EC%9D%B4%EC%9A%A9%EB%B0%A9%EB%B2%95.mp4"
              }
              width={500}
              height={400}
              loop
              autoPlay
              muted
              preload="auto"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoModal;
