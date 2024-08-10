import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducer/profile";

export const Store = configureStore({
  reducer: userSlice,
});
