import './App.css';
import { useToast } from "./hooks/use-toast"
import { Button } from "./components/ui/button"

function App() {
  const { toast } = useToast()
  return (
    <div className="App">
      {/* hier kommt Zeug rein */}
      <Button
      variant="outline"
      onClick={() => {
        toast({
          description: "Your message has been sent.",
        })
      }}
    >
      Show Toast
    </Button>
    </div>
  );
}

export default App;
