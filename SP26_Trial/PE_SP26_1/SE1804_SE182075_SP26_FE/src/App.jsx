import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShoesList from './components/ShoesList';
import ShoesView from './components/ShoesView';
import ShoesForm from './components/ShoesForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShoesList />} />
        <Route path="/shoes/add" element={<ShoesForm />} />
        <Route path="/shoes/view/:id" element={<ShoesView />} />
        <Route path="/shoes/edit/:id" element={<ShoesForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
