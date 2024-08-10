import { BrowserRouter } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./routes/Main";
import { Provider } from "react-redux";
import { Store } from "./store/store";
// import MainComponent from "./components/MainComponent";

function App() {
  return (
    <div>
      <Provider store={Store}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
