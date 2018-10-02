import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/index";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";

const persistConfig = {
    key: "root",
    storage,
};

// const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(reduxThunk)));

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(applyMiddleware(reduxThunk)),
);
export const persistor = persistStore(store);
