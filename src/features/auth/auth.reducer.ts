import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { Dispatch } from "redux";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    })
  },
});

// thunks
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.login(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsError.length
        handleServerAppError(res.data, dispatch,isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

 const logout = createAppAsyncThunk<{ isLoggedIn: boolean },undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
   const { dispatch, rejectWithValue } = thunkAPI;
   try {
     dispatch(appActions.setAppStatus({ status: "loading" }));
     const res = await authAPI.logout();
     if (res.data.resultCode === 0) {
       dispatch(clearTasksAndTodolists());
       dispatch(appActions.setAppStatus({ status: "succeeded" }));
       return{ isLoggedIn: false };
     } else {
       handleServerAppError(res.data, dispatch);
       return rejectWithValue(null);
     }

   }catch (e){
     handleServerNetworkError(e, dispatch);
     return rejectWithValue(null);
   }
 })

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean },undefined>(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch,false);
      return rejectWithValue(null);
    }
  }
  catch (e){
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  }
})




export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login ,logout,initializeApp};
