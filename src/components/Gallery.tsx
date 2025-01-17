import React from 'react';
import GalleryImage from './GalleryImage';
import GalleryNoImage from './GalleryNoImage'; // Importa el nuevo componente
import { imageTexts } from '../data/imageTexts';

import libraryGirl from '../assets/girls/library.webp';
import motorcycleGirl from '../assets/girls/motocycle.webp';
import milf from '../assets/girls/milf.webp';
import gamerGirl from '../assets/girls/gamer.webp';
import cheerleader from '../assets/girls/cheerleader.webp';

const imageUrls = [
  { src: libraryGirl, imageName: 'library' },
  { src: motorcycleGirl, imageName: 'motocycle' },
  { src: milf, imageName: 'milf' },
  { src: gamerGirl, imageName: 'gamer' },
  { src: cheerleader, imageName: 'cheerleader' },
];

const Gallery: React.FC = () => {
  const victories = JSON.parse(localStorage.getItem('victories') || '[]');

  return (
    <div className="flex w-11/12 gap-8 justify-center flex-wrap">
      {imageUrls.map((image, index) => {
        // Encuentra la información asociada a la imagen
        const imageInfo = imageTexts.find((text) => text.imageName === image.imageName);

        // Verifica si el nombre de la imagen está en el array de victories
        const isVictory = victories.includes(image.imageName);

        return isVictory ? (
          <GalleryImage
            key={index}
            src={image.src}
            info={imageInfo} // Pasamos la info como prop
          />
        ) : (
          <GalleryNoImage key={index} />
        );
      })}
    </div>
  );
};

export default Gallery;
