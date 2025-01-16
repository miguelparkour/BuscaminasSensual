import React, { useState, useEffect } from 'react';
import { Cell } from '../models/types';
import CellComponent from './CellComponent';
import { imageTexts } from '../data/imageTexts';

interface BoardProps {
  grid: Cell[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onDoubleReveal: (row: number, col: number) => void;
  onTouchStartCell: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEndCell: (e: React.TouchEvent, row: number, col: number) => void;
  isVictory: boolean;
  bgImage: () => string; // Función para obtener la imagen
  resetBoard: boolean;
}

const Board: React.FC<BoardProps> = ({
  grid,
  onReveal,
  onFlag,
  onDoubleReveal,
  onTouchStartCell,
  onTouchEndCell,
  isVictory,
  bgImage,
  resetBoard,
}) => {
  // Manejo de la imagen aleatoria de fondo
  const [randomImage, setRandomImage] = useState<string>('');

  /**
   * Indica en qué "etapa" de la victoria estamos:
   *  - 0: no se ha hecho clic (celdas visibles).
   *  - 1: se ocultan celdas (primer clic).
   *  - 2: se hace flip, se pone blur y se muestra texto (segundo clic).
   */
  const [victoryStage, setVictoryStage] = useState(0);

  // Estado para el estilo del div de fondo con la imagen
  const [bgStyle, setBgStyle] = useState({
    transform: 'rotateY(0deg)',
    transformOrigin: 'center center',
    transition: 'transform 1s, filter 1s ease', // Añadimos transición al filtro
    backfaceVisibility: 'visible' as 'visible',
    filter: 'opacity(0.4) blur(12px)', // Añadimos el filtro inicial
  });

  // Estado para la opacidad de la capa de celdas
  const [customStyle, setCustomStyle] = useState({
    opacity: 1,
    transition: 'opacity 0.5s',
  });

  // Estado para mostrar/ocultar el texto final (el Lorem)
  const [showFinalText, setShowFinalText] = useState(false);

  // Estado para el nombre de la imagen aleatoria
  const [textForImage, setTextForImage] = useState({
    imageName: '',
    quote: '""',
    name: 'Unknown',
    age: 0,
    height: 0,
    hair: 'Unknown',
    description: 'No description available',
  });

  useEffect(() => {
    // Cargamos la imagen de fondo al montar el componente
    const image = bgImage();
    setRandomImage(image);
    const girl = findTextByImageName(image);
    setTextForImage(girl);
  }, [bgImage]);

  useEffect(() => {
    // Si se resetea el tablero, volvemos todo a su estado inicial
    if (resetBoard) {
      setVictoryStage(0);

      setBgStyle((prev) => ({
        ...prev,
        transform: 'rotateY(0deg)',
      }));
      setCustomStyle({
        opacity: 1,
        transition: 'opacity 0.5s',
      });
      setShowFinalText(false);
    }
  }, [resetBoard]);

  useEffect(() => {
    // Actualizar el filtro dinámicamente según victoryStage e isVictory
    setBgStyle((prev) => ({
      ...prev,
      filter: getBackgroundFilter(), // Aquí aplicamos la lógica para el filtro
    }));
  }, [isVictory, victoryStage]); // Dependencias

  // Calcula el filtro que se aplicará al fondo en función de victoryStage e isVictory
  const getBackgroundFilter = () => {
    // Si todavía NO hay victoria, mantenemos el blur de siempre
    if (!isVictory) {
      return 'opacity(0.4) blur(12px)';
    }
    // Si hay victoria pero estamos en la etapa 2, queremos reactivar ese blur
    // para que se vea difuminado de nuevo
    if (victoryStage === 2) {
      return 'opacity(0.4) blur(12px)';
    }
    // Si hay victoria pero estamos en etapa 0 o 1, sin blur
    return '';
  };

  // Evento de clic en la capa de celdas
  const handleClick = () => {
    // Si NO hay victoria, mantenemos el comportamiento anterior
    if (!isVictory) {
      // Reseteamos la opacidad de la capa de celdas
      setCustomStyle((prev) => ({ ...prev, opacity: 1 }));
      // Reseteamos la rotación del fondo
      setBgStyle((prev) => ({ ...prev, transform: 'rotateY(0deg)' }));
      return;
    }

    // Si HAY victoria, manejamos las "etapas"
    switch (victoryStage) {
      case 0:
        // PRIMER CLIC:
        // Ocultamos la capa de las celdas (opacity = 0)
        setCustomStyle((prev) => ({ ...prev, opacity: 0 }));
        // Avanzamos a etapa 1
        setVictoryStage(1);
        break;

      case 1:
        // SEGUNDO CLIC:
        // 1) Giramos el fondo (flip)
        setBgStyle((prev) => ({
          ...prev,
          transform: 'rotateY(180deg)',
        }));
        // 2) Activamos el blur en el fondo => lo hacemos con getBackgroundFilter (victoryStage=2)
        // 3) Mostramos el texto final
        // Avanzamos a etapa 2
        setVictoryStage(2);
        setShowFinalText(true);
        break;

      default:
        // Si se clica más veces, se vuelve al primer estado
        setVictoryStage(0);
        setShowFinalText(false);
        setCustomStyle((prev) => ({ ...prev, opacity: 1 }));
        setBgStyle((prev) => ({
          ...prev,
          transform: 'rotateY(360deg)',
        }));
        break;
    }
  };

  const findTextByImageName = (imageName: string) => {
    const image = imageTexts.find((img) => imageName.includes(img.imageName));
    return (
      image || {
        imageName: '',
        quote: '""',
        name: 'Unknown',
        age: 0,
        height: 0,
        hair: 'Unknown',
        description: 'No description available',
      }
    );
  };


  // let textForImage = findTextByImageName(randomImageName);

  return (
    // Contenedor con `perspective` para dar sensación de profundidad al rotar
    <div className="relative" style={{ perspective: '1000px' }}>
      {/* Div de fondo con la imagen */}
      <div
        className="grid grid-cols-8 gap-1 p-4 bg-gray-800 bg-cover bg-center rounded-3xl absolute w-full h-full"
        style={{
          ...bgStyle, // bgStyle ya incluye el filtro dinámico
          backgroundImage: `url(${randomImage})`,
        }}
      />

      {/* Capa de las celdas (interactiva) */}
      <div
        className="grid grid-cols-8 gap-1 p-4 bg-gray-800 z-10 relative bg-transparent select-none"
        onClick={handleClick}
        onTouchStart={handleClick} // en móvil
        style={customStyle}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onReveal={onReveal}
              onFlag={onFlag}
              onDoubleReveal={onDoubleReveal}
              onTouchStartCell={onTouchStartCell}
              onTouchEndCell={onTouchEndCell}
            />
          ))
        )}
      </div>

      {/* Texto final (solo se muestra en la etapa 2) */}
      <div
        className={`
    absolute top-0 left-0 w-full h-full flex items-center justify-center
    text-white p-4 text-center bg-transparent
    transition-opacity duration-700 ease-in-out
    ${showFinalText ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `}
      >
        <p className="p-6 rounded-lg backdrop-blur-sm text-white">
          <p className="italic text-xl text-pink-400">“{textForImage.quote}”</p>

          <ul className="mt-4 space-y-1 text-start ml-16 mb-3">
            <li><strong className="text-pink-300">Nombre:</strong> {textForImage.name}</li>
            <li><strong className="text-pink-300">Edad:</strong> {textForImage.age}</li>
            <li><strong className="text-pink-300">Altura:</strong> {textForImage.height}</li>
            <li><strong className="text-pink-300">Cabello:</strong> {textForImage.hair}</li>
          </ul>
          
          <p className="text-white leading-relaxed">{textForImage.description}</p>


        </p>
      </div>


    </div>
  );
};

export default Board;
