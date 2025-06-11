import {createStore,applyMiddleware,compose} from "redux";
import { thunk } from "redux-thunk"; 
import { reducers } from "../reducers";

export const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
       // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)
// import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk';
// // import your reducers here
// import rootReducer from './reducers';

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(thunk),
// });
