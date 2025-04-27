// API Response type
export interface ApiResponse {
  data: any;
  error: any;
}

// Patient related types
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
  name?: Name;
  birthdate: string; // format: date
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

// Illness related types
export interface IllnessRequest {
  illnessId?: number;
  illness: string[];
  description: string;
  illnessDate: string; // format: date
}

// Checkup related types
export interface CheckupRequestDto {
  patientId: number;
  doctorId: number;
  appointmentDate: string; // format: date
  appointmentId?: number;
  checkupStatus?: string;
  prescription: string;
  extraComment: string;
}

// Patient response type (for display)
export interface Patient {
  id: number;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  birthdate: string;
  gender: string;
  email: string;
  mobileNo?: number;
  bloodGroup: string;
  maritalStatus: string;
  occupation: string;
  isSmoker: boolean;
  isAlcoholic: boolean;
  hasInsurance: boolean;
}

// Doctor response type
export interface Doctor {
  id: number;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  specialization: string;
  email: string;
  mobileNo?: number;
  available: boolean;
}

// Appointment type
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  status: string;
  patientName?: string;
  doctorName?: string;
}

// Illness history type
export interface IllnessHistory {
  illnessId: number;
  illness: string[];
  description: string;
  illnessDate: string;
  patientId: number;
}