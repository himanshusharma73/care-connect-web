import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { PatientRequest, IllnessRequest } from '../models/patient.model';
import { MatDialog } from '@angular/material/dialog';
import { AddIllnessDialogComponent } from '../add-illness-dialog/add-illness-dialog.component';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css'],
})
export class PatientAddComponent {
  patientId: number | null = null;
  patientForm: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  illnessHistory: IllnessRequest = { illnessDate: '', illness: [], description: '' };

  constructor(
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.patientForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
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
        country: [''],
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
      selfPay: [false],
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
      emergencyContactNumber: formValue.emergencyContactNumber
        ? Number(formValue.emergencyContactNumber)
        : undefined,
    };

    this.patientService.addPatient(newPatient).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Patient added successfully';
        const illnessHistory = JSON.parse(
          localStorage.getItem('illnessHistory') || '{}'
        );
        this.patientId = response.data.patientId;
        if (this.patientId !== null) {
          this.saveIllnessHistory(this.patientId, illnessHistory);
        } else {
          this.error = 'Failed to retrieve patient ID.';
        }
        localStorage.removeItem('illnessHistory');

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

  openIllnessPopup(): void {
    const dialogRef = this.dialog.open(AddIllnessDialogComponent, {
      data: { patientId: this.patientId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.illnessHistory = result;
        console.log("Illness added");
      }
    });
  }

  editillness(): void {
    const illnessHistory = JSON.parse(localStorage.getItem('illnessHistory') || '{}');
    const dialogRef = this.dialog.open(AddIllnessDialogComponent, {
      data: { patientId: this.patientId, illnessRequest: illnessHistory },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.illnessHistory = result;
      }
    });
  }

  onCancel(): void {
    this.clearIllnessHistoryOnUnload();
    this.router.navigate(['/patients']);
  }

  saveIllnessHistory(patientId: number, illnessHistory: IllnessRequest): void {
    this.patientService.saveIllness(patientId, illnessHistory).subscribe(
      (response) => {
        console.log('Illness saved successfully', response);
      },
      (error) => {
        console.error('Error saving illness:', error);
      }
    );
  }

  clearIllnessHistoryOnUnload() {
    localStorage.removeItem('illnessHistory');
  }

  hasIllnessHistory(): boolean {
    return (
      this.illnessHistory.illnessDate !== '' ||
      this.illnessHistory.illness.length > 0 ||
      this.illnessHistory.description !== ''
    );
  }

  deleteIllness() {
    this.illnessHistory = {
    illness: [],
    description: '',
    illnessDate: ''
  };
    this.clearIllnessHistoryOnUnload()
  }
}
