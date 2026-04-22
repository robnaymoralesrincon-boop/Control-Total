import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center">
        <div className="bg-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i className="fas fa-network-wired text-2xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Somos Red</h1>
        <p className="text-slate-500 mt-2">EXONET v3.9 cargando...</p>
        <div className="mt-6">
          <input 
            type="password" 
            placeholder="Introduce tu clave" 
            className="w-full p-3 bg-slate-100 rounded-xl border-none text-center outline-indigo-500"
          />
          <button className="w-full bg-indigo-600 text-white mt-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Acceder al Sistema
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
