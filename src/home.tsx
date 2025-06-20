import { FC, useState } from 'react';
import Backgroud from './background';
import EntryManager from './components/entry-manager';
import { useLocalStorageChange } from './hooks/use-local-storage-listener';

const loadSettings = () => {
  return JSON.parse(localStorage.getItem('settings') || '{}').isProd ?? false
}
const App: FC = () => {
  const [isProd, setIsProd] = useState<boolean>(loadSettings)
  useLocalStorageChange((_, value) => {
    const settings = JSON.parse(value || '{}')
    setIsProd(settings.isProd)
  })
  return (
    <>
      {isProd && (
        <div className="p-3 bg-yellow-500 text-yellow-950 sticky top-0 z-10">
          Warning: You are currently using a production configuration. Please proceed with caution, as changes made in this environment may directly impact live systems.
        </div>
      )}
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        <Backgroud />
        <EntryManager />
      </div>
    </>
  );
}

export default App;