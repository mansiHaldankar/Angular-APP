import { Subject } from 'rxjs';
import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();
  recipeChanged = new Subject <Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Noodles',
  //     'https://static.toiimg.com/photo/75356205.cms',
  //     'A flavourful dish of sizzling Hakka noodles tossed with shredded chicken, vegetables and spicy',
  //     [
  //       new Ingredient ('Chicken', 250),
  //       new Ingredient ('Noodles', 250)
  //     ]
  //   ),
  //   new Recipe(
  //     'Pizza',
  //     'https://feenix.co.in/wp-content/uploads/2018/02/chunky-chicken.jpg',
  //     'This Hawaiian BBQ Chicken Pizza is loaded with cheese, barbecue sauce, pineapple and more',
  //     [
  //       new Ingredient ('Bread', 250),
  //       new Ingredient ('Cheese', 250)
  //     ]
  //   )
  // ];

  recipes: Recipe[] = [];


  constructor( private shoppingListService: ShoppingListService) { }

  setRecipes(recipes){
    this.recipes = recipes;
    this.recipeChanged.next([...this.recipes]);
  }

  getRecipes(){
    // return this.recipes.slice(); // Return true copy
    return [...this.recipes];
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.shoppingListService.addIngredients(ingredients);
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next([...this.recipes]);
  }

  addRecipe(newRecipe: Recipe){
    this.recipes.push(newRecipe);
    this.recipeChanged.next([...this.recipes]);
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipeChanged.next([...this.recipes]);
  }
}
