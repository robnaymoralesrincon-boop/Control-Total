import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Control Total
        </h1>
        <p className="text-gray-600 mb-6">
          Tu aplicación está en línea y funcionando con React + Tailwind.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
          Comenzar
        </button>
      </div>
    </div>
  )
}

export default App

