import { User } from "../user/types";
import { BillCalcRule } from "../billCalcRule/types";

export interface Bill {
  id?: number;
  dateFrom: string;
  dateTo: string;
  value: number;

  billCalcRuleId?: number;
  billCalcRule?: BillCalcRule;

  userId?: number;
  user?: User;
}
