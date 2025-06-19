import { FC } from 'react';
import Backgroud from './background';
import EntryManager from './components/entry-manager';

const App: FC = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Backgroud />
      <EntryManager />
    </div>
  );
}

export default App;