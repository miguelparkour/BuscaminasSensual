import React, { useState } from 'react';
import { ImageText } from '../data/imageTexts';

interface GalleryImageProps {
  src: string;
  info?: ImageText;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ src, info }) => {
  const [isFlipped, setIsFlipped] = useState(false); // Estado para manejar el giro
  const [bgStyle, setBgStyle] = useState({
    transform: 'rotateY(0deg)',
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.7s, filter 0.7s ease',
    filter: 'none',
  });

  const handleClick = () => {
    if (!isFlipped) {
      // Girar la imagen y añadir blur
      setBgStyle((prev) => ({
        ...prev,
        transform: 'rotateY(180deg)',
        filter: 'blur(12px) opacity(0.6) brightness(0.40)',
      }));
      setIsFlipped(true);
    } else {
      // Volver al estado original
      setBgStyle((prev) => ({
        ...prev,
        transform: 'rotateY(0deg)',
        filter: 'none',
      }));
      setIsFlipped(false);
    }
  };

  return (
    <div
      className="relative w-96 h-96"
      style={{ perspective: '1000px' }} // Añadimos perspectiva para el efecto 3D
      onClick={handleClick}
    >
      {/* Imagen visible con animación */}
      <div
        className="absolute w-full h-full rounded-lg shadow-md"
        style={bgStyle}
      >
        <img
          src={src}
          alt={info?.name || 'Gallery item'}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Texto sobre la imagen cuando está girada */}
        <div
          className={`
            absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white text-center rounded-lg p-4
            transition-opacity duration-700 ease-in-out
            ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          style={{
            transition: 'opacity 0.7s',
            opacity: isFlipped ? 1 : 0,
          }}
        >
          <p className="italic text-xl text-pink-400 mb-4">"{info?.quote}"</p>
          <ul className="text-sm space-y-1">
            <li>
              <strong className="text-pink-300">Nombre:</strong> {info?.name}
            </li>
            <li>
              <strong className="text-pink-300">Edad:</strong> {info?.age}
            </li>
            <li>
              <strong className="text-pink-300">Altura:</strong> {info?.height} m
            </li>
            <li>
              <strong className="text-pink-300">Cabello:</strong> {info?.hair}
            </li>
          </ul>
          <p className="mt-4 text-sm">{info?.description}</p>
        </div>
    </div>
  );
};

export default GalleryImage;
