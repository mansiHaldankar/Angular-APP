import { DataStorageService } from './../../shared/data-storage.service';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  // recipes: Recipe[] = [
  //   new Recipe('Noodles', 'Test', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2017/11/chicken-noodles-500x447.jpg'),
  //   new Recipe('Noodles', 'Test', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2017/11/chicken-noodles-500x447.jpg')
  // ]

  recipes: Recipe[];
  updatedRecipes: Subscription;

  // @Output() sendSelectedRecipe = new EventEmitter<Recipe>();

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.updatedRecipes = this.recipeService.recipeChanged.
    subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
    });
    // this.recipes = this.recipeService.getRecipes();
    this.dataStorageService.fetchRecipes().subscribe();

  }

  // onSendSelectedRecipe(recipe){
  //   this.sendSelectedRecipe.emit(recipe);
  // }

  onAddRecipe(){
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.updatedRecipes.unsubscribe();
  }
}
