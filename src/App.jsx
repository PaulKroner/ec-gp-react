import './App.css';
import { useToast } from "./hooks/use-toast"
import Dashboard from './pages/dashboard/dashboard';

function App() {
  const { toast } = useToast()
  return (
    <main className="App">
      <Dashboard />
    </main>
  );
}

export default App;
