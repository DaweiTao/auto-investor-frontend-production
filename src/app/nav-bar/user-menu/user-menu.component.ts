import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  @Input() avatarSrc: string | undefined
  @Input() userName: string | undefined

  constructor(private auth: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    
  }

  public async onLogout() {
    await this.auth.logout()
    alert("Logout successfull!")
    this.router.navigate(["/login"])
  }

}
