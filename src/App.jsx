import React, { useState, useEffect } from 'react';

// Estilos globales de fuentes e impresión (se mantienen igual que tu HTML)
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
    @media print {
      header, .no-print, button, #search-input, .filters-container { display: none !important; }
      body { background-color: white !important; padding: 0 !important; }
      .table-container { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
    }
  `}</style>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState([]);
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {
    const saved = localStorage.getItem('exonet_v39_dated');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const login = () => {
    if (password === "admin") setIsLoggedIn(true);
    else alert("Código de acceso incorrecto.");
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
    setShowModal(false);
    e.target.reset();
  };

  const deleteRecord = (id) => {
    if (window.confirm("¿Confirmas la eliminación?")) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('exonet_v39_dated', JSON.stringify(updated));
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.obs.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === 'all' || r.month.toString() === monthFilter;
    let matchesType = true;
    if (filterMode === 'income') matchesType = r.income > 0;
    if (filterMode === 'expense') matchesType = r.expense > 0;
    return matchesSearch && matchesMonth && matchesType;
  });

  const totals = filteredRecords.reduce((acc, r) => ({
    income: acc.income + r.income,
    expense: acc.expense + r.expense
  }), { income: 0, expense: 0 });

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-50">
        <GlobalStyles />
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-key text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EXONET <span className="text-indigo-600 text-lg">v3.9</span></h1>
          <input 
            type="password" 
            className="w-full px-4 py-3 bg-slate-100 border rounded-xl mb-4 text-center mt-4 focus:bg-white outline-none" 
            placeholder="CLAVE DE ACCESO"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && login()}
          />
          <button onClick={login} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
            Entrar al Sistema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalStyles />
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">Gestión Financiera</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Somos Red</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs no-print">
          <i className="fas fa-print mr-2"></i> Imprimir Reporte
        </button>
      </header>

      <main className="flex-1 p-4 md:p-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 no-print">
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-indigo-500 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Items</p>
            <h4 className="text-2xl font-bold">{filteredRecords.length}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Ingresos</p>
            <h4 className="text-2xl font-bold text-emerald-600">${totals.income.toLocaleString()}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-rose-500 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Egresos</p>
            <h4 className="text-2xl font-bold text-rose-600">${totals.expense.toLocaleString()}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-slate-800 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Saldo</p>
            <h4 className="text-2xl font-bold">${(totals.income - totals.expense).toLocaleString()}</h4>
          </div>
        </div>

        {/* Filtros y Acción */}
        <div className="bg-white p-4 rounded-2xl border mb-6 no-print shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="flex-1 p-2.5 bg-slate-50 border rounded-xl text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-600 outline-none"
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="all">Todos los Meses</option>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <div className="flex gap-2">
               {['all', 'income', 'expense'].map(mode => (
                 <button 
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
                 >
                   {mode === 'all' ? 'Todo' : mode === 'income' ? 'Ingresos' : 'Egresos'}
                 </button>
               ))}
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95">
            <i className="fas fa-plus mr-2"></i> Registrar Movimiento Manual
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concepto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Ingreso</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Egreso</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider no-print">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {r.date.split('-').reverse().join('/')}
                      <div className="text-[9px] text-indigo-400 uppercase">{MONTHS[r.month]}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{r.name}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">${r.income.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-500">${r.expense.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center no-print">
                      <button onClick={() => deleteRecord(r.id)} className="text-slate-300 hover:text-rose-500 transition"><i className="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <form onSubmit={saveRecord} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-indigo-600 px-8 py-5 text-white">
              <h3 className="font-bold text-lg">Nueva Transacción</h3>
              <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Somos Red</p>
            </div>
            <div className="p-8 space-y-4">
              <input name="date" type="date" required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold" defaultValue={new Date().toISOString().substr(0, 10)} />
              <input name="name" type="text" placeholder="Concepto" required className="w-full px-5 py-3 bg-slate-50 border rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <input name="income" type="number" placeholder="Ingreso $" step="0.01" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold text-emerald-600" />
                <input name="expense" type="number" placeholder="Egreso $" step="0.01" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl font-bold text-rose-600" />
              </div>
              <textarea name="obs" placeholder="Observaciones" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl resize-none"></textarea>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-400 font-bold">Cancelar</button>
                <button type="submit" className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700">Guardar</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
