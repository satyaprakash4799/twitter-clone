import { configureStore } from "@reduxjs/toolkit";

import currentUserReducer, { userReducer} from './slices/userSlice';

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    user: userReducer,
  }
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default store;