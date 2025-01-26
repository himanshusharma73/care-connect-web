import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { PatientRequest } from '../models/patient.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit {
  patientId: number | null = null;
  patientForm: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.patientId) {
      this.loadPatientData();
    }
  }

  loadPatientData(): void {
    if (!this.patientId) return;

    this.loading = true;
    this.patientService.getPatientById(this.patientId).subscribe(
      (response) => {
        if (response.data) {
          this.patientForm.patchValue(response.data);
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load patient data';
        this.loading = false;
        console.error('Error loading patient:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const updatedPatient: PatientRequest = {
      ...this.patientForm.value,
      patientId: this.patientId
    };

    this.patientService.updatePatient(updatedPatient).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Patient updated successfully';
        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.error = 'Failed to update patient. Please try again.';
        console.error('Error updating patient:', error);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
}