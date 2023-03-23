import logo from "./logo.svg";
import "./App.css";
import { MessageBoard } from "./components/MessageBoard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>AWS CDK vs Terraform</p>
        <MessageBoard />
      </header>
    </div>
  );
}

export default App;
