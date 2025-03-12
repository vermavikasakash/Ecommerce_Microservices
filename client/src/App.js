import { Routes, Route } from "react-router-dom";
import ProductPage from "./screens/ProductHomePage";
import ProductCartPage from "./screens/ProductCartPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/cart" element={<ProductCartPage />} />
      </Routes>
    </>
  );
}

export default App;
