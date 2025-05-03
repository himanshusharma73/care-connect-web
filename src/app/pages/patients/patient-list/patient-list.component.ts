import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from 'src/app/models/api-types';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.data) {
          this.patients = response.data as Patient[];
          this.filteredPatients = [...this.patients];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }
    
    this.filteredPatients = this.patients.filter(patient => 
      patient.name.firstName.toLowerCase().includes(term) ||
      patient.name.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term) ||
      patient.bloodGroup.toLowerCase().includes(term)
    );
    console.log(this.filteredPatients);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}