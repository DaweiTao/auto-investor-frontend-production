import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


export interface SignupData{
  email: string,
  password: string
  avatarSrc: string,
  username: string,
}

export interface LoginData{
  email: string,
  password: string
}


interface Profile {
  uid: string,
  username: string,
  email: string,
  avatarSrc: string,
  role: string,
  createdAt: string,
  updatedAt: string,
}


const AUTH_API_URL = environment.apiUrl + '/auth'


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public currentUserProfile$: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null)

  constructor(private http: HttpClient, private router: Router) { 
    this.initSession()
  }

  public initSession() {
    const token = this.getToken()
    console.log(`Token retrieved: (${token})`)
    
    if (token == "foo") {
      this.logout()
      return
    }

    const isTokenExpired = this.isTokenExpired(token)
    console.log("Is token expired: ", isTokenExpired)

    if (isTokenExpired) {
      console.log("Token expired or invalid, logout")
      this.logout()
      return
    }

    this.isAuth$.next(true)
    const profile = this.getUserProfile()
    
    if (profile) {
      this.currentUserProfile$.next(profile)
    } else {
      this.currentUserProfile$.next(null)
    }
  }

  public async signUp(signupData: SignupData) {
    const response: any = await firstValueFrom(this.http.post(AUTH_API_URL + "/signup", signupData))
    if (!response.success) {
      throw response.message
    }
  }

  public async login(loginData: LoginData) {
    const response: any = await firstValueFrom(this.http.post(AUTH_API_URL + "/login", loginData))
    if (response.success) {
      // handle jwt
      this.saveToken(response.token)
      this.saveUserProfile(response.userProfile)
      this.isAuth$.next(true)
      this.currentUserProfile$.next(response.userProfile)
      this.router.navigate(["/watchlist"])
    } else {
      throw response.message
    }
  }

  public async logout(){
    let success = await this.clearStoredData()
    if (!success) {
      throw "Logout failed!"
    }
    this.isAuth$.next(false)
    this.currentUserProfile$.next(null)
  }

  private saveToken(token: string){
    localStorage.setItem("token", token)
  }

  private saveUserProfile(userProfile: Profile){
    localStorage.setItem("profile", JSON.stringify(userProfile))
  }

  private clearStoredData() {
    return new Promise<boolean>((resolve, reject) => {
      localStorage.removeItem("token")
      localStorage.removeItem("profile")
      resolve(true)
    })
  }

  public getToken(): string{
    let savedToken = localStorage.getItem("token")
    const token = savedToken ? savedToken : "foo"
    return token
  }

  private isTokenExpired(token: string){
    try {
      let nowMillisec = moment().valueOf()
      let expiresExpMillisec = this.getTokenExpirationEpoch(token) * 1000
      console.log("Current date: ", moment(nowMillisec).format("DD MMM YYYY hh:mm a"))
      console.log("Expiration date: ", moment(expiresExpMillisec).format("DD MMM YYYY hh:mm a"))
      return nowMillisec > expiresExpMillisec
    } catch (e) {
      console.log("Token err: ", e);
      return true
    }
  }

  public getTokenExpirationEpoch(token: string){
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return expiry
  }

  public getUserProfile(){
    const profileJson = localStorage.getItem("profile")
    if (profileJson) {
      const profile: Profile = JSON.parse(profileJson)
      return profile
    }
    return null
  }

}
