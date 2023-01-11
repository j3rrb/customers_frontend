import * as Yup from "yup";
import { FormValidationMessages, LoginFormFields } from "../../types";

const LoginFormValidation: Yup.SchemaOf<LoginFormFields> = Yup.object().shape({
  email: Yup.string().email('E-mail inválido!').required(FormValidationMessages.OBRIGATORIO),
  password: Yup.string().required(FormValidationMessages.OBRIGATORIO),
});

export default LoginFormValidation;
