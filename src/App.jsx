import Header from './components/Header.jsx';
import Layout from './components/Layout.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="mx-auto max-w-4xl px-4 pb-16">
      <Layout />
    </main>
    <Toaster position="top-right" />
  </div>
);

export default App;
