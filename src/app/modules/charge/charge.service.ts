import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Charge } from "./charge.model";

const getAll = async () => Charge.find({ isActive: true });

const update = async (id: string, payload: Record<string, unknown>, user: JwtPayload) => {
  const charge = await Charge.findByIdAndUpdate(
    id,
    { ...payload, updatedBy: user._id },
    { returnDocument: "after", runValidators: true },
  );
  if (!charge) throw new AppError(httpStatus.NOT_FOUND, "Charge config not found");
  return charge;
};

export const ChargeServices = { getAll, update };
