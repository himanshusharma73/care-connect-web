import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { PatientRequest, Address } from '../models/patient.model';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})
export class PatientAddComponent {
  patientForm: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.patientForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required]
      }),
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      adharNo: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      }),
      bloodGroup: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      emergencyContactNumber: [''],
      isSmoker: [false],
      isAlcoholic: [false],
      preferredLanguage: ['', Validators.required],
      hasInsurance: [false],
      isMedicaidEligible: [false],
      selfPay: [false]
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.patientForm.value;
    const newPatient: PatientRequest = {
      ...formValue,
      mobileNo: formValue.mobileNo ? Number(formValue.mobileNo) : undefined,
      adharNo: formValue.adharNo ? Number(formValue.adharNo) : undefined,
      emergencyContactNumber: formValue.emergencyContactNumber ? Number(formValue.emergencyContactNumber) : undefined
    };

    this.patientService.addPatient(newPatient).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Patient added successfully';
        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.error = 'Failed to add patient. Please try again.';
        console.error('Error adding patient:', error);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
}