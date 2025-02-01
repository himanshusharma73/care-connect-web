import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IllnessRequest } from "../models/patient.model";
import { PatientService } from "../services/patient.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-illness-dialog",
  templateUrl: "./add-illness-dialog.component.html",
  styleUrls: ["./add-illness-dialog.component.css"],
})
export class AddIllnessDialogComponent {
  illnessForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddIllnessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number },
    private patientService: PatientService,
    private router: Router,
  ) {
    this.illnessForm = this.fb.group({
      illness: ['', Validators.required],
      description: ['', Validators.required],
      illnessDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.illnessForm.valid) {
      this.isSubmitting = true;
      this.error = "";

      const illnessRequest: IllnessRequest = {
        illness: [this.illnessForm.value.illness], 
        description: this.illnessForm.value.description,
        illnessDate: this.illnessForm.value.illnessDate,
      };

      console.log("Illness Request:", illnessRequest);

      if (this.data.patientId) {
        this.saveIllnessToBackend(illnessRequest);
      } else {
        this.saveIllnessLocally(illnessRequest);
      }
    }
  }

  saveIllnessToBackend(illnessRequest: IllnessRequest) {
    this.patientService.saveIllness(this.data.patientId, illnessRequest).subscribe(
      (response) => {
        this.dialogRef.close(illnessRequest);
        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 1500);
      },
      (error) => {
        this.error = 'Failed to add patient. Please try again.';
        console.error('Error adding patient:', error);
      })
  }

  saveIllnessLocally(illnessRequest: IllnessRequest) {
  
    const illnessList = JSON.parse(localStorage.getItem('illnessList') || '[]');
    illnessList.push(illnessRequest);
    localStorage.setItem('illnessHistory', JSON.stringify(illnessList));

    alert('Illness saved locally! It will be linked after saving the patient.');
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
