import * as yup from "yup";

const signupFormSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("kindly input a valid email")
      .required("email is required"),
    firstName: yup
      .string()
      .required("first name is required")
      .min(5, "first name should be at least five letters"),
    lastName: yup
      .string()
      .required("last name is required")
      .min(5, "last name should be at least five letters"),
    password: yup
      .string()
      .required("password is required")
      .min(5, "password should be at least five characters"),
  })
  .required();

const loginFormSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("kindly input a valid email")
      .required("email is required"),
    password: yup
      .string()
      .required("password is required")
      .min(5, "password should be at least five characters"),
  })
  .required();


  const createProductFormSchema = yup
  .object()
  .shape({
    productName: yup
      .string()
      .required("product name is required"),
      cost: yup
      .number()
      .required("cost is required"),
      amountRemaining: yup
      .number()
      .required("remaining amount is required"),
  })
  .required();

export { signupFormSchema, loginFormSchema, createProductFormSchema };
