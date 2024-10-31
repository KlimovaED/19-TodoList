
export type FieldErrorType={
  error: string;
  field: string;
}

export type BaseResponse<D = {}>={
  resultCode: number;
  messages: Array<string>;
  data: D;
  fieldsError: FieldErrorType[];
}
