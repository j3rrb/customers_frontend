export enum FormValidationMessages {
  OBRIGATORIO = "Obrigatório!",
  SELECIONE = "Selecione!",
  SENHAS_NAO_COINCIDEM = "As senhas não coincidem!",
  EMAIL_INVALIDO = "E-mail inválido!",
  MIN_PRAZO_EM_DIAS = "O prazo em dias deve ser maior que 1!",
  NUMERO_INVALIDO = "Número inválido!",
}

export enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Roles {
  CUSTOMER = "CUSTOMER",
  ARCHITECT = "ARCHITECT",
}

export enum OrderStatuses {
  ACCEPTED = "ACCEPTED",
  REFUSED = "REFUSED",
  OPENED = "OPENED",
  DELETED = "DELETED",
}

export type DefaultAPIError = {
  error: string;
  message: string;
  statusCode: number;
};

export type LoginFormFields = {
  email: string;
  password: string;
};

export type CreateAccountFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  gender: Genders;
  role: Roles;
  birthDate: string;
  password: string;
  confirmPassword: string;
};

export type CreateOrderFormFields = {
  customerId: number;
  architectId: number;
  detailsText: string;
  deadline: number;
};

export type EditOrderFormFields = {
  architectId?: number;
  detailsText?: string;
  deadline?: number;
  status?: OrderStatuses;
};

export type User = {
  birthDate: string;
  createdAt: string;
  email: string;
  firstName: string;
  gender: Genders;
  id: number;
  lastName: string;
  primaryPhoneNumber: string;
  role: Roles;
  secondaryPhoneNumber: string | null;
  updatedAt: string;
};

export type Order = {
  id: number;
  detailsText: Buffer;
  deadlineInDays: number;
  status: OrderStatuses;
  createdAt: string;
  updatedAt: string;
  architectId: number;
  customerId: number;
};
