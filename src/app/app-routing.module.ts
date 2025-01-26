import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { PatientAddComponent } from './patient-add/patient-add.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    component: PatientListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'patients/new',
    component: PatientAddComponent 
  },
  {
    path: 'patients/:id',
    component: PatientDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
     path: 'patients/edit/:id',
     component: PatientEditComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
