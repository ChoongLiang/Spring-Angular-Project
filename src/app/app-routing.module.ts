import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HelpComponent } from './components/help/help.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ProjectComponent } from './components/project/project.component';
import { FormulaComponent } from './components/formula/formula.component';
import { ErrorComponent } from './components/error/error.component';
import { SignupComponent } from './components/signup/signup.component';

import { AuthGuard } from './auth/auth.guard';
import { LoadingComponent } from './components/loading/loading.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'loading', component: LoadingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'help', component: HelpComponent },
  { path: 'resource', component: ResourceComponent, canActivate: [AuthGuard]},
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'formula', component: FormulaComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
