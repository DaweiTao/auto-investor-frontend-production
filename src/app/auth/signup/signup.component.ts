import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupData, UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public isLoading: boolean = false;
  public signupErrMsg: string | null | unknown = null;
  // public signupSuccessMsg: string | null | unknown = null;
  private userNameMinLength: number = 2;
  private userNameMaxLength: number = 18;
  private passwordMinLength: number = 10;
  private passwordMaxLength: number = 18;
  public avatarSrc: string = "";
  public signUpForm: FormGroup = this.initSignupFormGroup()

  constructor(private auth: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm.reset()
  }


  /******************************
  **     Form  Group           **
  ******************************/

  private initSignupFormGroup() {
    return new FormGroup({
      "usernameCtl": new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Za-z0-9_]*$"),
        Validators.minLength(this.userNameMinLength),
        Validators.maxLength(this.userNameMaxLength),
      ]),
      "emailCtl": new FormControl(null, [
        Validators.required, 
        Validators.email
      ]),
      "passwordCtl": new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
      ]),
      "passwordConfirmCtl": new FormControl(null, [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
        this.passwordMatchValidator()
      ]),
      // "dobCtl": new FormControl(null,[
      //   Validators.required,
      // ]),
      "agreementCtl" : new FormControl(null,[
        Validators.requiredTrue,
      ])
    })
  }

  /******************************
  **     Username Validation   **
  ******************************/

  private isUsernameRequireErr() {
    return this.signUpForm.get("usernameCtl")?.hasError("required");
  }

  private isUsernameLengthErr() {
    return this.signUpForm.get("usernameCtl")?.hasError("minlength") 
    || this.signUpForm.get("usernameCtl")?.hasError("maxlength");
  }

  private isUsernamePatternErr() {
    return this.signUpForm.get("usernameCtl")?.hasError("pattern");
  }

  public isValidUsername() {
    return this.signUpForm.get("usernameCtl")?.valid;
  }

  public getErrMsgUsername(): string {
    if (this.isUsernameRequireErr()) {
      return "You must enter a username";
    } else if (this.isUsernameLengthErr()) {
      return `Acceptable length: ${this.userNameMinLength} - ${this.userNameMaxLength} characters`
    } else if (this.isUsernamePatternErr()) {
      return "Invalid username";
    }

    return ''
  }


  /***************************
  **     Email Validation   **
  ***************************/

  private isEmailRequireErr() {
    return this.signUpForm.get("emailCtl")?.hasError("required");
  }

  private isEmailValid() {
    return this.signUpForm.get("emailCtl")?.hasError("email")
  }

  isValidEmail(){
    // return this.signUpForm.get('emailCtl')?.touched && this.signUpForm.get('emailCtl')?.valid
    return this.signUpForm.get('emailCtl')?.valid;
  }

  getErrMsgEmail(): string {
    if (this.isEmailRequireErr()) return "You must enter an email";
    return this.isEmailValid() ? "Invalid email" : "";
  }

  /***************************
  **  Password Validation   **
  ***************************/

  private isPasswordRequireErr() {
    return this.signUpForm.get("passwordCtl")?.hasError("required");
  }

  private isPasswordLengthErr() {
    return this.signUpForm.get("passwordCtl")?.hasError("minlength") 
    || this.signUpForm.get("passwordCtl")?.hasError("maxlength");
  }
  
  isValidPassword(){
    // return this.signUpForm.get('passwordCtl')?.touched && this.signUpForm.get('passwordCtl')?.valid
    return this.signUpForm.get('passwordCtl')?.valid
  }

  getErrMsgPassword(): string {
    if (this.isPasswordRequireErr()) {
      return "You must enter a password";
    } else if (this.isPasswordLengthErr()) {
      return `Acceptable length: ${this.passwordMinLength} - ${this.passwordMaxLength} characters`
    } 

    return ""
  }

  getPasswordHintMsg(): string {
    return `Password length: ${this.passwordMinLength} - ${this.passwordMaxLength} characters`
  }


  /****************************************
  **  Password Confirmation Validation   **
  ****************************************/

  private isPasswordConfirmRequireErr() {
    return this.signUpForm.get("passwordConfirmCtl")?.hasError("required");
  }

  private isPasswordConfirmLengthErr() {
    return this.signUpForm.get("passwordConfirmCtl")?.hasError("minlength")
    || this.signUpForm.get("passwordConfirmCtl")?.hasError("maxlength");
  }
  
  // private isPasswordMatchErr() {
  //   return this.signUpForm.get("passwordConfirmCtl")?.getError('passwordMatchError');
  // }
  
  isValidPasswordConfirmation(){
    // return this.signUpForm.get('passwordConfirmCtl')?.touched && this.signUpForm.get('passwordConfirmCtl')?.valid
    return this.signUpForm.get('passwordConfirmCtl')?.valid;
  }
  
  isPasswordMatchErr() {
    return this.signUpForm.get("passwordConfirmCtl")?.getError('passwordMatchError');
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password: any = control?.parent?.get("passwordCtl")?.value;
        const confirmPassword: any = control?.parent?.get("passwordConfirmCtl")?.value;
        // console.log(password, confirmPassword);
        // if password matches return null (stands for case: true), else password not match
        return confirmPassword && password && confirmPassword === password 
        ? null : {"passwordMatchError": true};
    }   
  }
  
  getErrMsgConfirmPassword(): string {
    if (this.isPasswordConfirmRequireErr()) {
      return "Type your password again";
    } else if (this.isPasswordConfirmLengthErr()) {
      return `Acceptable length: ${this.passwordMinLength} - ${this.passwordMaxLength} characters`
    } else if (this.isPasswordMatchErr()) {
      return "Password doesn't match"
    }

    return ""
  }

  getPasswordMatchMsg() {
    return "Confirmation success !"
  }

  /***************************************
  **        Agreement Validation        **
  ***************************************/

  private isRequireTrueErr() {
    return this.signUpForm.get("agreementCtl")?.hasError("required");
  }

  public isValidAgreement() {
    return this.signUpForm.get("agreementCtl")?.valid;
  }

  public getHintMsgAgreement(){
    return "Must be checked"
  }

  public getErrMsgAgreement() {
    return this.isRequireTrueErr() ? "Required *" : ""
  }


  /***************************************
  **           Form Validation          **
  ***************************************/


  public isValidSignupForm() {
    return this.signUpForm.valid;
  }

  
  /**************************************
  **              Avatar               **
  **************************************/


  private getAvatarSrc(name: string) {
    const colorArr = ["f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"]
    let randColor = colorArr[Math.floor(Math.random() * colorArr.length)];
    return `https://ui-avatars.com/api/?name=${name}&background=${randColor}&size=64&color=FFFFFF`
  }

  /**************************************
  **           Event Handling          **
  ***************************************/

  public onUpdatePassword() {
    this.signUpForm.controls["passwordConfirmCtl"].updateValueAndValidity();
  }

  public onChangeUsername(event: any) {
    const username = event.target.value;
    this.avatarSrc = this.getAvatarSrc(username);
    // console.log(this.avatarSrc)
    this.signUpForm.controls["usernameCtl"].updateValueAndValidity();
  }

  public async onSubmit(){
    this.signupErrMsg = null
    const authData: SignupData = {
      email: this.signUpForm.value.emailCtl,
      password: this.signUpForm.value.passwordCtl,
      username: this.signUpForm.value.usernameCtl,
      avatarSrc: this.avatarSrc,
    }

    this.isLoading = true

    try{
      if (!this.isValidSignupForm()){
        throw "Signup Form not valid!"
      }
      
      await this.auth.signUp(authData)
      this.signUpForm.reset()
      const loginData = {
        email: authData.email,
        password: authData.password,
      }
      await this.auth.login(loginData)
      alert(`Account creation success! Welcome, ${authData.username}`)
      this.router.navigate(["/watchlist"])
    } catch(errMsg) {
      this.signupErrMsg = errMsg
    }
    
    this.isLoading = false
  }


}
