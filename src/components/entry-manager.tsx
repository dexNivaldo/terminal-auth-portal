import { FunctionComponent } from 'react'
import useAuthEntry from '../hooks/use-auth-entry';
import { AlertCircle, CheckCircle, Copy, Save, X } from 'lucide-react';

const EntryManager: FunctionComponent = () => {
  const { 
    handleSubmit,
    handleDelete,
    handleOpenLink,
    handleSave,
    handleTagClick,
    terminals,
    patente,
    setPatente,
    terminal,
    setTerminal,
    savedEntries,
    isLoading,
    result,
    copyToClipboard,
    showToast,
    success,
    error
  } = useAuthEntry()

  return (
    <>
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
                value={`${terminal}`}
                onChange={(e) => setTerminal(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-xl border-0 bg-slate-800/50 backdrop-blur-sm p-3 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                required
              >
                <option value="">Select terminal</option>
                {terminals.map((t) => (
                  <option key={t.code} value={t.id}>
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
                      {entry.patente} • {entry.terminal.code}
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

          {isLoading && (

            <div role="status" className="flex justify-center">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-700 animate-spin dark:text-purple-900 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
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
    </>
  )
}

export default EntryManager
