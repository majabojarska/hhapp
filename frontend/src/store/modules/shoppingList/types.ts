import { Shop } from "../shop/types";
import { User } from "../user/types";

export interface ShoppingListItem {
  id?: number;
  name: string;
  quantity: number;

  shoppingList?: ShoppingList;
  shoppingListId?: number;
}

export interface ShoppingList {
  id?: number;
  name: string;

  shop?: Shop | null;
  shopId?: number | null;

  user?: User | null;
  userId?: number | null;

  items?: ShoppingListItem[];

  active?: boolean;
}
