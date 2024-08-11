import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    addUser: (state: { user: unknown }, action) => {
      const user = {
        id: nanoid(),
        text: action.payload,
      };
      state.user = user;
    },
    updateUser: (state: { user: unknown }, action) => {
      (
        state.user as { text: { profile: { profile_photo: unknown } } }
      ).text.profile.profile_photo = action.payload;
    },
    updateNotification: (state: { user: unknown }, action) => {
      (
        state.user as { text: { notification: unknown[] } }
      ).text.notification.push(action.payload);
    },
  },
});

export const { addUser, updateUser, updateNotification } = userSlice.actions;
export default userSlice.reducer;
