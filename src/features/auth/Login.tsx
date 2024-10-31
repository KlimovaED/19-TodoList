import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { useAppDispatch } from "common/hooks";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { authThunks } from "features/auth/auth.reducer";
import { BaseResponse } from "../../common/types/common.types";

export const Login = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: "Email is required",
        };
      }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        return {
          email: "Invalid email address",
        }
      }
      if (!values.password) {
        return {
          password: "Password is required",
        };
      }else if(values.password.length < 6){
        return {
          password: "Password must be at least 6 characters",
        }
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .then(() => {})
        .catch((err:BaseResponse) => {
          if(err.fieldsError){
            err.fieldsError.forEach((error) => {
              formik.setFieldError(error.field,error.error)
            })
          }
        })
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
              <TextField  type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password}/>
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} disabled={!formik.isValid || !formik.dirty} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
