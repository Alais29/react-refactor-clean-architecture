import { AppProvider } from "./presentation/context/AppProvider";
import { ProductsPage } from "./presentation/pages/ProductsPage";

function App() {
  return (
    <AppProvider>
      <ProductsPage />
    </AppProvider>
  );
}

export default App;
