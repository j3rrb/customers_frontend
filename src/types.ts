export enum FormValidationMessages {
  OBRIGATORIO = "Obrigatório!",
  SELECIONE = "Selecione!",
  SENHAS_NAO_COINCIDEM = "As senhas não coincidem!",
  EMAIL_INVALIDO = "E-mail inválido!",
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

export type LoginFormFields = {
  email: string;
  password: string;
};

export type DefaultAPIError = {
  error: string;
  message: string;
  statusCode: number;
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
