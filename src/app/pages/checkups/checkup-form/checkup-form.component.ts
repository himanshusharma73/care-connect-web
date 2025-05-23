import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckupService } from 'src/app/services/checkup.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';
import { Location } from '@angular/common';
import { AppointmentService } from 'src/app/services/appointment.service';

interface Patient {
  patientId: number;
  name: {
    firstName: string;
    lastName: string;
  };
}

interface Doctor {
  doctorId: number;
  name: {
    firstName: string;
    lastName: string;
  };
  specialization: string;
}

@Component({
  selector: 'app-checkup-form',
  templateUrl: './checkup-form.component.html',
  styleUrls: ['./checkup-form.component.scss']
})
export class CheckupFormComponent implements OnInit {
  checkupForm: FormGroup;
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  isLoading: boolean = false;
  checkupStatuses: string[] = ['Completed', 'Active', 'Cancelled'];
  
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private checkupService: CheckupService,
    private appointmentService: AppointmentService,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.checkupForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.route.queryParams.subscribe(params => {
    const appointmentId = params['appointmentId'];
    if (appointmentId) {
      this.prefillFromAppointment(appointmentId);
    }
  });
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: [null, Validators.required],
      doctorId: [null, Validators.required],
      appointmentDate: [new Date().toISOString().split('T')[0], Validators.required],
      checkupStatus: ['Completed'],
      prescription: ['', Validators.required],
      extraComment: ['', Validators.required]
    });
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

  onSubmit(): void {
    if (this.checkupForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.checkupForm.getRawValue()
    this.checkupService.saveCheckup(formData).subscribe({
    
      next: () => {
       
        this.isLoading = false;
        this.router.navigate(['/dashboard/patients', formData.patientId]);
      },
      error: (error) => {
        console.error('Error saving checkup:', error);
        this.isLoading = false;
      }
    });
  }


  isFieldInvalid(controlName: string): boolean {
    const control = this.checkupForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

   goBack(): void {
  this.location.back();
}

prefillFromAppointment(appointmentId: number): void {
  this.appointmentService.getAppointmentById(appointmentId).subscribe({
    next: (response) => {
      const appointment = response.data?.[0];
      if (!appointment) return;
      this.checkupForm.patchValue(appointment);
      this.checkupForm.patchValue({checkupStatus: appointment.status});

      this.checkupForm.get('patientId')?.disable();
      this.checkupForm.get('doctorId')?.disable();
    },
    error: (err) => {
      console.error('Error loading appointment:', err);
    }
  });
}
}