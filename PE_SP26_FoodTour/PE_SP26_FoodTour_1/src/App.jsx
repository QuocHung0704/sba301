import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TourList from './pages/TourList';
import TourView from './pages/TourView';
import TourForm from './pages/TourForm';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TourList />} />
        <Route path="/tour/add" element={<TourForm />} />
        <Route path="/tour/view/:id" element={<TourView />} />
        <Route path="/tour/edit/:id" element={<TourForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
