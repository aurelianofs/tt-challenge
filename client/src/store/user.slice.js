import { createSlice } from '@reduxjs/toolkit'

const getStoredUser = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    return storedUser;
  } else {
    return {};
  }
}

export const user = createSlice({
  name: 'user',
  initialState: {
    user: getStoredUser()
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = user.actions

export default user.reducer
