import { Injectable } from '@angular/core';

@Injectable({
 providedIn:'root'
})
export class AuthService{

 login(
 email:string,
 password:string
){

 const usersData=
 localStorage.getItem('users');

 if(!usersData){

   return false;

 }

 const users=JSON.parse(usersData);

 const matchedUser=users.find(
  (user:any)=>

   user.email===email
   &&
   user.password===password

 );

 if(matchedUser){

 localStorage.setItem(
  'token',
  'fake-jwt-token'
 );

 localStorage.setItem(
  'loggedInUser',
  JSON.stringify(matchedUser)
 );

 return true;

}

 return false;

}

 isLoggedIn(){

   return localStorage.getItem('token');

 }

 logout(){

   localStorage.removeItem('token');

 }

}