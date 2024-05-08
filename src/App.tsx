import { AppProvider } from "./context/AppProvider";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
    return (
        <AppProvider>
            <ProductsPage />
        </AppProvider>
    );
}

export default App;
