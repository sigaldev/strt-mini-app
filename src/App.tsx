import { ThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./routes/AppRouter.tsx";

function App() {

    return (
        <ThemeProvider>
            <AppRouter />
        </ThemeProvider>
    );
}

export default App;
