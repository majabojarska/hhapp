import { Category } from "../category/types";
import { User } from "../user/types";
import { Shop } from "../shop/types";

export interface Purchase {
  id?: number;
  name: string;
  price: number;
  date: string;
  isShared: boolean;

  boughtBy?: User;
  boughtById?: number | null;

  boughtFor?: User;
  boughtForId?: number | null;

  category?: Category;
  categoryId?: number;

  shop?: Shop;
  shopId?: number;
}
