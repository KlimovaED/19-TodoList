import { appActions } from "../../app/app.reducer";
import { handleServerNetworkError } from "./handle-server-network-error";
import { AppDispatch, AppRootStateType } from "../../app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { BaseResponse } from "../types/common.types";

type ThunkApi = BaseThunkAPI<AppRootStateType, unknown,AppDispatch,null|BaseResponse>


export const thunkTryCatch =async <T>(thunkAPI:ThunkApi,logic:()=>Promise<T>):Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    return await logic()

  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
}
