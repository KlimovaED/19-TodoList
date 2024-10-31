import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponse } from "common/types/common.types";

/**
 * handleServerAppError - функция, которая обрабатывает ошибки
 * @param data  fmas
 * @param dispatch dnckisdj
 * @param idShowError dsafncks
 * @returns функция ничего ек возврашает
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch,idShowError:boolean= true) => {
  if(idShowError){
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
