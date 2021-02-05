import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from './../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  // ingredients: Ingredient[] = [
  //   new Ingredient ('Apple', 50),
  //   new Ingredient ('Tomato', 15)
  // ]

  ingredients: Ingredient[];
  ingredientChangeSub = new Subscription();

  constructor( private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientChangeSub = this.shoppingListService.ingredientsChanged.subscribe((ingredient: Ingredient[]) => {
      this.ingredients = ingredient;
    });
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ingredientChangeSub.unsubscribe();
  }

  // onAddedIngredient(evt){
  //   this.ingredients.push(evt);
  // }
}
