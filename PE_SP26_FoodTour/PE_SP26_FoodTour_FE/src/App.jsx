import { BrowserRouter, Route, Routes } from "react-router-dom";
import TourForm from "./pages/TourForm";
import TourList from "./pages/TourList";
import TourView from "./pages/TourView";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TourList />} />
        <Route path="/foodtour/add" element={<TourForm />} />
        <Route path="/foodtour/:id" element={<TourView />} />
        <Route path="/foodtour/edit/:id" element={<TourForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;