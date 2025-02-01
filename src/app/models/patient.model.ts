export interface ApiResponse {
  data: any;
  error: any;
}

export interface Name {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PatientRequest {
  patientId?: number;
  name: Name;
  birthdate: string;
  gender: string;
  email: string;
  mobileNo?: number;
  adharNo?: number;
  address?: Address;
  bloodGroup: string;
  maritalStatus: string;
  occupation: string;
  emergencyContactNumber?: number;
  isSmoker: boolean;
  isAlcoholic: boolean;
  preferredLanguage: string;
  hasInsurance: boolean;
  isMedicaidEligible: boolean;
  selfPay?: boolean;
}

export interface IllnessRequest {
  patientId?: number;
  illness: string[];
  description: string;
  illnessDate: string;
}