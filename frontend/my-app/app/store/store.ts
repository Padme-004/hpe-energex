// app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
// Remove authReducer import

export const store = configureStore({
  reducer: {
    // Remove 'auth' from reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;