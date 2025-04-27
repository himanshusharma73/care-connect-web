import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/api-types';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = true;
  searchTerm = '';
  displayedColumns: string[] = ['name', 'gender', 'birthdate', 'bloodGroup', 'email', 'actions'];

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.data) {
          this.patients = response.data as Patient[];
          this.filteredPatients = [...this.patients];
        }
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
        // For demo purposes, set some mock data
        this.patients = [
          {
            id: 1,
            name: { firstName: 'John', lastName: 'Doe' },
            birthdate: '1990-01-01',
            gender: 'Male',
            email: 'john@example.com',
            bloodGroup: 'O+',
            maritalStatus: 'Single',
            occupation: 'Engineer',
            isSmoker: false,
            isAlcoholic: false,
            hasInsurance: true
          },
          {
            id: 2,
            name: { firstName: 'Jane', lastName: 'Smith' },
            birthdate: '1985-05-15',
            gender: 'Female',
            email: 'jane@example.com',
            bloodGroup: 'A+',
            maritalStatus: 'Married',
            occupation: 'Teacher',
            isSmoker: false,
            isAlcoholic: false,
            hasInsurance: true
          }
        ];
        this.filteredPatients = [...this.patients];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(
      patient => 
        patient.name.firstName.toLowerCase().includes(term) ||
        patient.name.lastName.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term)
    );
  }
}