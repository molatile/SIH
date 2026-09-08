import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Languages from './pages/Languages';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
    <h1 className="text-4xl text-indigo font-yatra">{title} Page Coming Soon</h1>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dance" element={<Placeholder title="Dance" />} />
          <Route path="painting" element={<Placeholder title="Painting" />} />
          <Route path="languages" element={<Languages />} />
          <Route path="food" element={<Placeholder title="Food" />} />
          <Route path="clothes" element={<Placeholder title="Clothes" />} />
          <Route path="festivals" element={<Placeholder title="Festivals" />} />
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
