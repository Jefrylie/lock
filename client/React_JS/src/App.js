import "./App.css";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { LoadingProvider } from "./service/LoadingContext";
function App() {
  return (
    <>
      <LoadingProvider>
        <Routes>{routes.map((val) => val)}</Routes>
      </LoadingProvider>
    </>
  );
}

export default App;
