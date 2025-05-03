import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss']
})
export class ViewPatientComponent implements OnInit {
onEdit() {
throw new Error('Method not implemented.');
}
  patient: any; // Define the type according to your patient model
  isLoading: boolean = true;
router: any;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    this.loadPatient(patientId);
  }

  loadPatient(id: string | null): void {
    if (id) {
      console.log('Patient ID:', id);
        const patientId = Number(id);
        this.patientService.getPatientById(patientId).subscribe({
            next: (response) => {
                this.patient = response.data; 
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading patient:', error);
                this.isLoading = false;
            }
        });
    } else {
        console.error('No patient ID provided');
        this.isLoading = false;
    }
  }

  // Method to format the date
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }
}