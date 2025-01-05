import React from 'react';

interface ModalMessageProps {
  message: string;
  onClose: () => void;
}

const ModalMessage: React.FC<ModalMessageProps> = ({ message, onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white p-6 rounded-md shadow-md text-center text-blue-950">
        <h2 className="text-lg font-bold mb-4">{message}</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalMessage;
