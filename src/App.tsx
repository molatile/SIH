import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Languages from './pages/Languages';
import Dance from './pages/Dance';
import Painting from './pages/Painting';
import PaintingDetail from './pages/PaintingDetail';

import Clothes from './pages/Clothes';
import Festivals from './pages/Festivals';
import Food from './pages/Food';

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
          <Route path="dance" element={<Dance />} />
          <Route path="painting" element={<Painting />} />
          <Route path="painting/:id" element={<PaintingDetail />} />
          <Route path="languages" element={<Languages />} />
          <Route path="food" element={<Food />} />
          <Route path="clothes" element={<Clothes />} />
          <Route path="festivals" element={<Festivals />} />
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
