import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, Validators as validator } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm =new FormGroup({
    name:new FormControl(
      '',
      [
        validator.required,
      ]
    ),
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

  constructor(private router:Router){}
 register(){

 if(this.registerForm.valid){

   const newUser=this.registerForm.value;

   const usersData=
   localStorage.getItem('users');

   let users=[];

   if(usersData){

     users=JSON.parse(usersData);

   }

   users.push(newUser);

   localStorage.setItem(
    'users',
    JSON.stringify(users)
   );

   alert("Registration Successful");

   this.router.navigate(['/']);

 }

}

}
