import * as Yup from "yup";
import {
  FormValidationMessages,
  CreateAccountFormFields,
  Genders,
  Roles,
} from "../../types";

const CreateAccountFormValidation: Yup.SchemaOf<CreateAccountFormFields> =
  Yup.object().shape({
    firstName: Yup.string().required(FormValidationMessages.OBRIGATORIO),
    lastName: Yup.string().required(FormValidationMessages.OBRIGATORIO),
    email: Yup.string()
      .email(FormValidationMessages.EMAIL_INVALIDO)
      .required(FormValidationMessages.OBRIGATORIO),
    primaryPhoneNumber: Yup.string().required(
      FormValidationMessages.OBRIGATORIO
    ),
    secondaryPhoneNumber: Yup.string().notRequired(),
    gender: Yup.mixed<Genders>()
      .oneOf(Object.values(Genders), FormValidationMessages.SELECIONE)
      .required(FormValidationMessages.OBRIGATORIO),
    role: Yup.mixed<Roles>()
      .oneOf(Object.values(Roles), FormValidationMessages.SELECIONE)
      .required(FormValidationMessages.OBRIGATORIO),
    birthDate: Yup.string().required(FormValidationMessages.OBRIGATORIO),
    password: Yup.string().required(FormValidationMessages.OBRIGATORIO),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        FormValidationMessages.SENHAS_NAO_COINCIDEM
      )
      .required(FormValidationMessages.OBRIGATORIO),
  });

export default CreateAccountFormValidation;
