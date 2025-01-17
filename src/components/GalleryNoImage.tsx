import React from 'react';
import noImage from '../assets/images/noimage.webp';

const GalleryNoImage: React.FC = () => {
  return <div className="relative w-96 h-96">
    <div
        className="absolute w-full h-full rounded-lg shadow-md"
      >
        <img
          src={noImage}
          alt='girl locked'
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
  </div>;
};

export default GalleryNoImage;
