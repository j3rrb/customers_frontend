import * as Yup from "yup";
import {
  EditOrderFormFields,
  FormValidationMessages,
} from "../../../../../types";

const EditOrderFormValidation: Yup.SchemaOf<
  Omit<EditOrderFormFields, "status" | "architectId">
> = Yup.object().shape({
  deadline: Yup.number()
    .typeError(FormValidationMessages.NUMERO_INVALIDO)
    .min(1, FormValidationMessages.MIN_PRAZO_EM_DIAS),
  detailsText: Yup.string(),
});

export default EditOrderFormValidation;
