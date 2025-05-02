import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';

interface Patient {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
}

interface Doctor {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
  specialization: string;
}

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  specializations: string[] = [];
  isLoading: boolean = false;
  showDoctorSelect: boolean = true;
  minDate: string;
  
  constructor(
    private fb: FormBuilder,
    public router: Router, // Make router public
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {
    this.appointmentForm = this.createForm();
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadSpecializations();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: [null, Validators.required],
      doctorId: [null],
      specialization: [null],
      appointmentDate: [new Date().toISOString().split('T')[0], Validators.required],
      appointmentStartTime: this.fb.group({
        hour: [9, Validators.required],
        minute: [0, Validators.required]
      })
    }, { validators: this.doctorOrSpecializationValidator });
  }

  doctorOrSpecializationValidator(control: AbstractControl): ValidationErrors | null {
    const doctorId = control.get('doctorId')?.value;
    const specialization = control.get('specialization')?.value;
    
    if (!doctorId && !specialization) {
      return { noDoctorOrSpecialization: true };
    }
    
    return null;
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.data) {
          this.patients = response.data as Patient[];
        }
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (response) => {
        if (response.data) {
          this.doctors = response.data as Doctor[];
        }
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  loadSpecializations(): void {
    this.doctorService.getSpecializations().subscribe({
      next: (response) => {
        if (response.data) {
          this.specializations = response.data as string[];
        }
      },
      error: (error) => {
        console.error('Error loading specializations:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.appointmentForm.value;

    // Format the time
    const { hour, minute } = formData.appointmentStartTime;
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Create the appointment data
    const appointmentData = {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      specialization: formData.specialization,
      appointmentDate: formData.appointmentDate,
      appointmentStartTime: formattedTime
    };

    this.appointmentService.bookAppointment(appointmentData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/appointments']);
      },
      error: (error) => {
        console.error('Error booking appointment:', error);
        this.isLoading = false;
      }
    });
  }

  // Helper method to check if a form control is invalid and touched
  isFieldInvalid(controlName: string): boolean {
    const control = this.appointmentForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  isTimeFieldInvalid(controlName: string): boolean {
    const timeGroup = this.appointmentForm.get('appointmentStartTime');
    if (!timeGroup) return false;
    
    const control = timeGroup.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}