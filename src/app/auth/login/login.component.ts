import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginData, UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.initLoginFormGroup();
  public isLoading: boolean = false;
  public loginErrMsg: string | null | unknown = null;

  constructor(private auth: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.loginErrMsg = null;
    this.initLoginFormGroup()
  }

  private initLoginFormGroup(){
    return new FormGroup({
      "emailCtl": new FormControl(null, [
        Validators.required, 
        Validators.email
      ]),
      "passwordCtl": new FormControl(null, [
        Validators.required,
      ])
    })
  }


  /***************************
  **     Email Validation   **
  ***************************/

  private isEmailRequireErr() {
    return this.loginForm.get("emailCtl")?.hasError("required");
  }

  private isEmailValid() {
    return this.loginForm.get("emailCtl")?.hasError("email")
  }

  isValidEmail(){
    return this.loginForm.get('emailCtl')?.valid;
  }

  getErrMsgEmail(): string {
    if (this.isEmailRequireErr()) return "You must enter an email";
    return this.isEmailValid() ? "Invalid email" : "";
  }

  /***************************
  **  Password Validation   **
  ***************************/

  private isPasswordRequireErr() {
    return this.loginForm.get("passwordCtl")?.hasError("required");
  }

  isValidPassword(){
    return this.loginForm.get('passwordCtl')?.valid
  }

  getErrMsgPassword(): string {
    return this.isPasswordRequireErr() ? "You must enter a password" : "";
  }

  /***************************************
  **           Form Validation          **
  ***************************************/

  public isValidLoginForm() {
    return this.loginForm.valid;
  }

  /**************************************
  **           Event Handling          **
  ***************************************/

  public async onSubmit(){
    this.loginErrMsg = null
    const authData: LoginData = {
      email: this.loginForm.value.emailCtl,
      password: this.loginForm.value.passwordCtl,
    }

    this.isLoading = true

    try{
      if (!this.isValidLoginForm()){
        throw "Login Form not valid!"
      }

      await this.auth.login(authData)
      
      this.loginForm.reset()
      alert(`Login Success!`);
      this.router.navigate(["/watchlist"])
      
    } catch(errMsg) {
      this.loginErrMsg = errMsg;
    }

    this.isLoading = false;
  }

}
