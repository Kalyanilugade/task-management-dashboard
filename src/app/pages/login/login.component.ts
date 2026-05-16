import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators as validator } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {RouterLink} from '@angular/router';
import{AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm=new FormGroup({
    email:new FormControl(
      '',
      [
        validator.required,
        validator.email
      ]
      
    ),

    password:new FormControl(
      '',
      [
        validator.required,
        validator.minLength(4)
      ]

    )
    
  });
  authService: any;

  constructor(
    private authservice:AuthService,
    private router:Router

  ){}

  login(){

 if(this.loginForm.valid){

   const email=this.loginForm.value.email;

   const password=this.loginForm.value.password;

   const result=this.authservice.login(
    email!,
    password!
   );

   if(result){

     alert("Login Successful");

     this.router.navigate(['/dashboard']);

   }
   else{

     alert("Invalid Credentials");

   }

 }

  }
}