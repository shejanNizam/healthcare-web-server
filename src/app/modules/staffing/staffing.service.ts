import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IStaffing } from "./staffing.interface";
import { Staffing, StaffingFaq } from "./staffing.model";

const getAll = async () => Staffing.find();

const getSingle = async (id: string) => {
  const staffing = await Staffing.findById(id);
  if (!staffing) throw new AppError(httpStatus.NOT_FOUND, "Staffing solution not found");
  return staffing;
};

const getAllFaqs = async () => StaffingFaq.find().populate("staffingId");

const create = async (payload: Partial<IStaffing>, user: JwtPayload) => {
  const exists = await Staffing.findOne({ type: payload.type });
  if (exists) throw new AppError(httpStatus.CONFLICT, `Staffing type "${payload.type}" already exists`);
  return Staffing.create({ ...payload, updatedBy: user._id });
};

const update = async (id: string, payload: Partial<IStaffing>, user: JwtPayload) => {
  const staffing = await Staffing.findByIdAndUpdate(
    id,
    { ...payload, updatedBy: user._id },
    { returnDocument: "after", runValidators: true },
  );
  if (!staffing) throw new AppError(httpStatus.NOT_FOUND, "Staffing solution not found");
  return staffing;
};

const patchFaq = async (
  id: string,
  payload: { action: "add" | "delete"; faqId?: string; question?: string; answer?: string },
  user: JwtPayload,
) => {
  const staffing = await Staffing.findById(id);
  if (!staffing) throw new AppError(httpStatus.NOT_FOUND, "Staffing solution not found");

  if (payload.action === "add") {
    if (!payload.question || !payload.answer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Question and answer are required to add a FAQ");
    }
    await StaffingFaq.create({ staffingId: id, question: payload.question, answer: payload.answer });
  } else {
    if (!payload.faqId) throw new AppError(httpStatus.BAD_REQUEST, "faqId required to delete");
    await StaffingFaq.findByIdAndDelete(payload.faqId);
  }

  await Staffing.findByIdAndUpdate(id, { updatedBy: user._id });
  return Staffing.findById(id);
};

const patchWhatWeDo = async (
  id: string,
  payload: { action: "add" | "delete"; item?: string },
  user: JwtPayload,
) => {
  const staffing = await Staffing.findById(id);
  if (!staffing) throw new AppError(httpStatus.NOT_FOUND, "Staffing solution not found");

  if (payload.action === "add") {
    if (!payload.item) throw new AppError(httpStatus.BAD_REQUEST, "item is required");
    staffing.whatWeDo = [...(staffing.whatWeDo ?? []), payload.item];
  } else {
    staffing.whatWeDo = (staffing.whatWeDo ?? []).filter((w) => w !== payload.item);
  }
  staffing.updatedBy = user._id as never;
  return staffing.save();
};

export const StaffingServices = { getAll, getSingle, getAllFaqs, create, update, patchFaq, patchWhatWeDo };
