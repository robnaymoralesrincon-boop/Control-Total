import React, { useState, useEffect } from 'react';

const EXONET = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState([]);
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  // Cargar datos al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('exonet_v39_dated');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const login = () => {
    if (password === 'admin') setIsLoggedIn(true);
    else alert('Clave incorrecta');
  };

  const saveRecord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dateInput = formData.get('date');
    const selectedDate = new Date(dateInput + "T00:00:00");

    const newRecord = {
      id: Date.now(),
      date: dateInput,
      name: formData.get('name'),
      income: parseFloat(formData.get('income')) || 0,
      expense: parseFloat(formData.get('expense')) || 0,
      obs: formData.get('obs'),
      month: selectedDate.getMonth(),
    };

    const updated = [newRecord, ...records].sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecords(updated);
    localStorage.setItem('exonet_v39_dated', JSON.stringify(updated));
    e.target.reset();
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-key text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EXONET <span className="text-indigo-600 text-lg">v3.9</span></h1>
          <input 
            type="password" 
            className="w-full px-4 py-3 bg-slate-100 rounded-xl mb-4 text-center mt-4" 
            placeholder="CLAVE DE ACCESO"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg"><i className="fas fa-calendar-alt"></i></div>
          <div>
            <h2 className="font-bold text-slate-800">Gestión Financiera</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Somos Red</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold">
          <i className="fas fa-print mr-2"></i> Imprimir
        </button>
      </header>

      <main className="p-4 md:p-8">
        {/* Aquí puedes añadir el resto de tu tabla y lógica de filtros siguiendo el estilo React */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="font-bold mb-4">Registrar Movimiento</h3>
           <form onSubmit={saveRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="date" type="date" required className="p-3 bg-slate-50 rounded-xl border" />
              <input name="name" type="text" placeholder="Concepto" required className="p-3 bg-slate-50 rounded-xl border" />
              <input name="income" type="number" placeholder="Ingreso $" className="p-3 bg-slate-50 rounded-xl border text-emerald-600 font-bold" />
              <input name="expense" type="number" placeholder="Egreso $" className="p-3 bg-slate-50 rounded-xl border text-rose-600 font-bold" />
              <textarea name="obs" placeholder="Observaciones" className="p-3 bg-slate-50 rounded-xl border md:col-span-2"></textarea>
              <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Guardar Registro</button>
           </form>
        </div>

        <div className="mt-8 overflow-x-auto bg-white rounded-2xl border">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-[10px] font-bold uppercase text-slate-400">Fecha</th>
                <th className="p-4 text-[10px] font-bold uppercase text-slate-400">Concepto</th>
                <th className="p-4 text-right text-[10px] font-bold uppercase text-slate-400">Ingreso</th>
                <th className="p-4 text-right text-[10px] font-bold uppercase text-slate-400">Egreso</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-sm font-bold text-slate-600">{r.date}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{r.name}</td>
                  <td className="p-4 text-right text-emerald-600 font-bold">${r.income.toFixed(2)}</td>
                  <td className="p-4 text-right text-rose-500 font-bold">${r.expense.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EXONET;
