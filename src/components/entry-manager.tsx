import { FunctionComponent } from 'react'
import useAuthEntry from '../hooks/use-auth-entry';
import { AlertCircle, CheckCircle, Copy, Save, Share2, X } from 'lucide-react';
import { AuthSettingsDrawer } from './drawer-settings';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EntryRole } from '@/types/auth-entry';

const EntryManager: FunctionComponent = () => {
  const {
    handleSubmit,
    handleDelete,
    handleOpenLink,
    handleSave,
    handleShare,
    handleTagClick,
    terminals,
    patente,
    setPatente,
    role,
    setRole,
    terminal,
    setTerminal,
    savedEntries,
    isLoading,
    loadingEntries,
    result,
    copyToClipboard,
    showToast,
    success,
    error
  } = useAuthEntry()

  return (
    <>
      <AuthSettingsDrawer />
      <div className="flex justify-center">
        <Card className="glass-effect max-w-lg w-[512px] mt-3">
          <CardHeader>
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
              Terminal Auth Portal
            </h2>
          </CardHeader>
          <CardContent>
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
                  className="mt-1 block w-full rounded-md border outline-none border-gray-700 bg-slate-800/50 p-3 ring-0 shadow-none text-zinc-200 placeholder:text-zinc-200 focus:border-blue-500"
                  placeholder="Type a patente"
                  required
                />
              </div>

              <div>
                <label htmlFor="terminal" className="mb-1 block text-sm font-medium text-gray-300">
                  Terminal
                </label>
                <Select
                  value={terminal?.toString()}
                  onValueChange={(value: string) =>
                    setTerminal(parseInt(value))
                  }
                >
                  <SelectTrigger
                    id="terminal"
                    className="w-full bg-slate-800/50 border-gray-700 h-12 text-zinc-200 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select a terminal" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {terminals.map((t) => (
                    <SelectItem
                      key={t.code}
                      value={t.id.toString()}
                      className="text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <Select
                  value={role}
                  onValueChange={(value: EntryRole) =>
                    setRole(value)
                  }
                >
                  <SelectTrigger
                    id="role"
                    className="w-full bg-slate-800/50 h-12 border-gray-700 text-zinc-200 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem
                      value="AA"
                      className="text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        Agente Aduanal (AA)
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="CARRIER"
                      className="text-zinc-200 focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        Carrier
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Authenticate
                </button>
                <div className="w-[1px] border-l h-[44px] border-slate-100/20" />
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-800 to-sky-900 hover:from-cyan-700 hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Save size={16} className="mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white glass-effect hover:bg-black/20"
                  title="Share"
                >
                  <Share2 size={16} />
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
                      className="group text-nowrap relative border-gray-500 border flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
                      onClick={() => handleTagClick(entry)}
                    >
                      <span className="text-sm block text-gray-300">
                        {entry.patente} • {entry.terminal.code}
                        <small className={`line-clamp-1 ${entry.role === 'AA' ? '' : 'text-blue-400'}`}>
                          {entry.role} Token
                        </small>
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
          </CardContent>
        </Card>
        <Card className={`${(result || isLoading) ? 'w-[448px] opacity-100' : 'w-0 opacity-0'} glass-effect max-w-md transition-all duration-500 ease-in-out mt-3`}>
          <CardContent>
            {(isLoading || loadingEntries) && (

              <div role="status" className="flex justify-center mt-3">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-700 animate-spin dark:text-purple-900 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>

            )}

            {result && (
              <>
                <div className="flex flex-wrap gap-2 pt-7">
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
          </CardContent>
        </Card>
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
