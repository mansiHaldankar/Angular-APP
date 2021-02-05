import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // @Output() featureSelected = new EventEmitter<string>();

  isAuthenticated = false;
  private usersub = new Subscription();

  constructor( private  dataStorageService: DataStorageService, private authService: AuthService ) { }

  ngOnInit(): void {
    this.usersub = this.authService.user.subscribe(
      userData => {
        this.isAuthenticated = userData? true : false;
      }
    );
  }

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  // onSelected(feature: string){
  //   this.featureSelected.emit(feature);
  // }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.usersub.unsubscribe();
  }

}
