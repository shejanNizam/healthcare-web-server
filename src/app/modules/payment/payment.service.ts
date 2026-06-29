import { QueryBuilder } from "../../utils/QueryBuilder";
import { Payment } from "./payment.model";

const getHistory = async (query: Record<string, string>) => {
  const baseQuery = Payment.find({ isDeleted: false }).populate("payerUserId", "name email");
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.filter().sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

export const PaymentServices = { getHistory };
