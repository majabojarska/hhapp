import { Category } from "../category/types";

export interface Shop {
  id?: number;
  name: string;
  color: string;

  defaultCategory?: Category | null;
  defaultCategoryId?: number | null;
}
