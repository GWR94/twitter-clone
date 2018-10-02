import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "./routes/AppRouter";
import "./styles/styles.scss";
import LoadingPage from "./components/LoadingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { store, persistor } from "./createStore";

const app = (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppRouter />
        </PersistGate>
    </Provider>
);

let hasRendered = false;
const renderApp = () => {
    if (!hasRendered) {
        ReactDOM.render(app, document.getElementById("app"));
        hasRendered = true;
    }
};

ReactDOM.render(<LoadingPage />, document.getElementById("app"));
renderApp();
