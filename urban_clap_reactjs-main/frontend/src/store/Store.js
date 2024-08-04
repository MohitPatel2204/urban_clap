import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Reducer/profile";

export const Store = configureStore({
  reducer: userSlice,
});
