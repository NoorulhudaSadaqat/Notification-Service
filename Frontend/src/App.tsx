import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import AppRoutes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
