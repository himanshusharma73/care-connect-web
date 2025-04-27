import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginPageComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { PatientListComponent } from './pages/patients/patient-list/patient-list.component';
import { PatientFormComponent } from './pages/patients/patient-form/patient-form.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/patients', component: PatientListComponent },
   { path: 'dashboard/patients/new', component: PatientFormComponent},
  // Add more routes as needed
  { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }