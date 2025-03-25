// // // app/features/authSlice.ts
// // import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// // interface AuthState {
// //   token: string | null;
// // }

// // const initialState: AuthState = {
// //   token: null,
// // };

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState,
// //   reducers: {
// //     setToken(state, action: PayloadAction<string>) {
// //       state.token = action.payload;
// //     },
// //     clearToken(state) {
// //       state.token = null;
// //     },
// //   },
// // });

// // export const { setToken, clearToken } = authSlice.actions;
// // export default authSlice.reducer;
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type UserRole = 'admin' | 'user' | 'guest' | null;

// interface AuthState {
//   userId: string | null;
//   email: string | null;
//   anonymousName: string | null;
//   role: UserRole;
//   accessToken: string | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   userId: null,
//   email: null,
//   anonymousName: null,
//   role: null,
//   accessToken: null,
//   isLoading: false,
//   error: null
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Main action to set all user data
//     setUser: (state, action: PayloadAction<Partial<AuthState>>) => {
//       return { ...state, ...action.payload };
//     },
    
//     // Specific action for just updating the token
//     setToken: (state, action: PayloadAction<string>) => {
//       state.accessToken = action.payload;
//     },
    
//     clearUser: () => initialState,
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     }
//   },
// });

// // Export ALL action creators
// export const { 
//   setUser,
//   setToken,  // Now properly exported
//   clearUser,
//   setLoading,
//   setError
// } = authSlice.actions;

// export default authSlice.reducer;
// features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: {
    userId: number | null;
    houseId: number | null;
    email: string | null;
    username: string | null;
    role: string | null;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;