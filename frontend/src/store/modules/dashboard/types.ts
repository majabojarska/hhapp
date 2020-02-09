import { User } from "../user/types";

export interface DashboardState {
  horizon: [string, string];
  sharedOnly: boolean;
}

export interface Payment {
  user: User;
  paymentTotal: number;
}
