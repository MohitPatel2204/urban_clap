import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  totalQuantity: 0,
  showCart: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    addUser: (state, action) => {
      const user = {
        id: nanoid(),
        text: action.payload,
      };
      state.user = user;
    },
    updateUser: (state, action) => {
      const user = {
        text: {
          ...state,
          profile: { profile_photo: action.payload },
        },
      };
      state.user = user;
    },
  },
});

export const { addUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
