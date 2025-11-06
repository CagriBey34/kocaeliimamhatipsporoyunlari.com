import React from 'react';

const VideoPreview = () => {
  return (
    <div className="mt-16 w-full flex items-center justify-center overflow-hidden">
      <a
        href="https://www.instagram.com/p/C8Cij8wCXsV/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-centen"
      >
        <img
          src="assets/video.jpg"
          alt="Öncü Spor Kulübü Video"
          className="w-[90%] sm:w-9/10 sm:h-[270px] xs:w-4/5 xs:h-[150px] object-cover"
        />
      </a>
    </div>
  );
};

export default VideoPreview;
