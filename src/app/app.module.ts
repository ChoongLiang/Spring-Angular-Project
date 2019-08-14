import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HelpComponent } from './components/help/help.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ProjectComponent } from './components/project/project.component';
import { FormulaComponent } from './components/formula/formula.component';
import { ErrorComponent } from './components/error/error.component';
import { SignupComponent } from './components/signup/signup.component';

import { SideBarService } from './services/side-bar.service';
import { SignupService } from './services/signup.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    SideBarComponent,
    HelpComponent,
    ResourceComponent,
    ProjectComponent,
    FormulaComponent,
    ErrorComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SideBarService, SignupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
