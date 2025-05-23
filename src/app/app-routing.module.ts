import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginPageComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { PatientListComponent } from './pages/patients/patient-list/patient-list.component';
import { PatientFormComponent } from './pages/patients/patient-form/patient-form.component';
import { ViewPatientComponent } from './pages/patients/view-patient/view-patient.component';
import { DoctorListComponent } from './pages/doctors/doctor-list/doctor-list.component';
import { AppointmentFormComponent } from './pages/appointments/appointment-form/appointment-form.component';
import { IllnessListComponent } from './pages/illness/illness-list/illness-list.component';
import { IllnessFormComponent } from './pages/illness/illness-form/illness-form.component';
import { DoctorViewComponent } from './pages/doctors/doctor-view/doctor-view.component';
import { DoctorFormComponent } from './pages/doctors/doctor-form/doctor-form.component';
import { CheckupFormComponent } from './pages/checkups/checkup-form/checkup-form.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/patients', component: PatientListComponent },
  { path: 'dashboard/patients/new', component: PatientFormComponent},
  { path: 'dashboard/patients/:id/edit', component: PatientFormComponent },
  { path: 'dashboard/patients/:id', component: ViewPatientComponent },
  { path: 'dashboard/doctors', component: DoctorListComponent },
  { path: 'dashboard/doctors/new', component: DoctorFormComponent },
  { path: 'dashboard/doctors/:id', component: DoctorViewComponent },
  { path: 'dashboard/doctors/:id/edit', component: DoctorFormComponent },
  { path: 'dashboard/appointments', component: AppointmentFormComponent },
  { path: 'dashboard/patients/:patientId/illnesses', component: IllnessListComponent },
  { path: 'dashboard/patients/:patientId/illnesses/new', component: IllnessFormComponent },
  { path: 'dashboard/checkups/new', component: CheckupFormComponent },
  { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }