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
    updateUser: (state: { user: any }, action) => {
      state.user.text.profile.profile_photo = action.payload;
    },
    updateNotification: (state: { user: any }, action) => {
      state.user?.text?.notification.push(action.payload);
    },
  },
});

export const { addUser, updateUser, updateNotification } = userSlice.actions;
export default userSlice.reducer;
