import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  // ingredientsChanged = new EventEmitter<Ingredient[]>();
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient ('Apple', 50),
    new Ingredient ('Tomato', 15)
  ]

  constructor() { }

  getIngredients(){
    // return this.ingredients.slice();
    return [...this.ingredients];
  }
  getIngredient(index){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    // this.ingredientsChanged.emit([...this.ingredients]);
    this.ingredientsChanged.next([...this.ingredients]);
  }

  addIngredients(ingredient: Ingredient[]){
    this.ingredients.push(...ingredient);
    // this.ingredientsChanged.emit([...this.ingredients]);
    this.ingredientsChanged.next([...this.ingredients]);
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next([...this.ingredients]);
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next([...this.ingredients]);
  }

}
