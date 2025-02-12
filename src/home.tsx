import React, { useState, useEffect, FC } from 'react';
import { Copy, AlertCircle, X, Save, CheckCircle } from 'lucide-react';
import Backgroud from './background';
import { authTerminal } from './services/auth.service';

interface SavedEntry {
  id: string;
  patente: string;
  terminal: string;
  terminalName: string;
}

interface AuthResponse {
  token: string;
  redirectUrl: string
}

const loadEntries = () => {
  const saved = localStorage.getItem('savedEntries');
    if (saved) {
      return JSON.parse(saved);
    }

    return []
}

const App: FC = () => {
  const [patente, setPatente] = useState('');
  const [terminal, setTerminal] = useState('');
  const [result, setResult] = useState<AuthResponse | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>(loadEntries);

  const terminals = [
    { code: 'LCT', name: 'LCT' },
    { code: 'ICAVE', name: 'ICAVE' },
    { code: 'EIT', name: 'EIT' },
    { code: 'TIMSA', name: 'TIMSA' }
  ];


  useEffect(() => {
    localStorage.setItem('savedEntries', JSON.stringify(savedEntries));
  }, [savedEntries]);

  const authenticate = async () => {
    try {
      const response = await authTerminal(terminal, patente)

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'An error occurred');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch {
      setError('Failed to connect to the server');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    
    authenticate();
  };

  const handleSave = () => {
    if (!patente || !terminal) return;

    const terminalName = terminals.find(t => t.code === terminal)?.name || terminal;
    const newEntry: SavedEntry = {
      id: Date.now().toString(),
      patente,
      terminal,
      terminalName,
    };

    setSavedEntries(prev => [newEntry, ...prev]);
    setShowToast(true);
    setSuccess('Entry saved successfully');
    setTimeout(() => {
      setShowToast(false)
      setSuccess('')
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setSavedEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleTagClick = (entry: SavedEntry) => {
    setPatente(entry.patente);
    setTerminal(entry.terminal);
    authenticate();
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank')
  }

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);

    setShowToast(true);
    setSuccess('Copied!');
    setTimeout(() => {
      setShowToast(false)
      setSuccess('')
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Backgroud />

      <div className="max-w-md mx-auto">
        <div className="glass-effect rounded-2xl shadow-2xl p-8 space-y-4">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Terminal Auth Portal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="patente" className="block text-sm font-medium text-gray-300">
                Patente
              </label>
              <input
                type="text"
                id="patente"
                value={patente}
                autoComplete="off"
                onChange={(e) => setPatente(e.target.value)}
                className="mt-1 block w-full rounded-xl border-0 bg-slate-800/50 backdrop-blur-sm p-3 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                placeholder="Enter patente"
                required
              />
            </div>

            <div>
              <label htmlFor="terminal" className="block text-sm font-medium text-gray-300">
                Terminal
              </label>
              <select
                id="terminal"
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="mt-1 block w-full rounded-xl border-0 bg-slate-800/50 backdrop-blur-sm p-3 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                required
              >
                <option value="">Select terminal</option>
                {terminals.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Authenticate
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
            </div>
          </form>

          {/* Saved Entries */}
          {savedEntries.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Saved Entries</h3>
              <div className="flex gap-2 flex-wrap">
                {savedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group text-nowrap relative border-gray-700 border flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
                    onClick={() => handleTagClick(entry)}
                  >
                    <span className="text-sm text-gray-300">
                      {entry.patente} • {entry.terminalName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      className="text-gray-700 p-1 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <>
            <div className="w-full border-b border-gray-700" />
            <div className="flex flex-wrap gap-2">
              <div
                className="group relative border-gray-700 border flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
                onClick={() => handleOpenLink(`http://localhost:3000/auth?token=${result.token}`)}
              >
                <span className="text-sm text-gray-300">
                  localhost
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(`http://localhost:3000/auth?token=${result.token}`);
                  }}
                  className="text-gray-700 p-1 hover:text-purple-400"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div
                className="group relative border-gray-700 border flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
                onClick={() => handleOpenLink(result.redirectUrl)}
              >
                <span className="text-sm text-gray-300">
                  website
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(result.redirectUrl);
                  }}
                  className="text-gray-700 p-1 hover:text-purple-400"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <div className="glass-card rounded-xl p-4 relative">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-hidden">
                  {JSON.stringify(result, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(result.token)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 flex items-center glass-effect px-6 py-4 rounded-xl shadow-lg">
          {success ? (
            <CheckCircle className="mr-2 text-green-400" size={20} />
          ) : (
            <AlertCircle className="mr-2 text-red-400" size={20} />
          )}
          <span className="text-gray-200">{success || error}</span>
        </div>
      )}
    </div>
  );
}

export default App;