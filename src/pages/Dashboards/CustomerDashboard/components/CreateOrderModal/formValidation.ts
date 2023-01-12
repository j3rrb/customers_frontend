import * as Yup from "yup";
import {
  CreateOrderFormFields,
  FormValidationMessages,
} from "../../../../../types";

const CreateOrderFormValidation: Yup.SchemaOf<
  Omit<CreateOrderFormFields, "status" | "customerId">
> = Yup.object().shape({
  deadline: Yup.number()
    .typeError(FormValidationMessages.NUMERO_INVALIDO)
    .min(1, FormValidationMessages.MIN_PRAZO_EM_DIAS)
    .required(FormValidationMessages.OBRIGATORIO),
  architectId: Yup.number().required(FormValidationMessages.OBRIGATORIO),
  detailsText: Yup.string().required(FormValidationMessages.OBRIGATORIO),
});

export default CreateOrderFormValidation;
