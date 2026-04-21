import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">R</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Control Total</h1>
        <p className="text-gray-500 mt-2">Tu ruta comienza aquí</p>
        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95">
          Empezar Registro
        </button>
      </div>
    </div>
  );
}

export default App;

