import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { ValueGroup } from "./value.interface";
import { Value } from "./value.model";

const validateGroup = (group: string): ValueGroup => {
  if (!Object.values(ValueGroup).includes(group as ValueGroup)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid group: ${group}`);
  }
  return group as ValueGroup;
};

const getAllByGroup = async (group: string) => {
  const g = validateGroup(group);
  return Value.find({ group: g, isDeleted: false }).sort("label");
};

const createValue = async (
  group: string,
  payload: { label: string; logo?: string },
  user: JwtPayload,
) => {
  const g = validateGroup(group);

  if (g === ValueGroup.Category && !payload.logo) {
    throw new AppError(httpStatus.BAD_REQUEST, "Logo is required for Category group");
  }

  const exists = await Value.findOne({ group: g, label: payload.label, isDeleted: false });
  if (exists) {
    throw new AppError(httpStatus.CONFLICT, `"${payload.label}" already exists in ${g}`);
  }

  return Value.create({ ...payload, group: g, createdBy: user._id });
};

const updateValue = async (
  group: string,
  id: string,
  payload: { label?: string; logo?: string },
) => {
  const g = validateGroup(group);

  const value = await Value.findOne({ _id: id, group: g, isDeleted: false });
  if (!value) throw new AppError(httpStatus.NOT_FOUND, "Value not found");

  if (payload.label && payload.label !== value.label) {
    const dup = await Value.findOne({ group: g, label: payload.label, isDeleted: false, _id: { $ne: id } });
    if (dup) throw new AppError(httpStatus.CONFLICT, `"${payload.label}" already exists in ${g}`);
  }

  Object.assign(value, payload);
  return value.save();
};

const deleteValue = async (id: string) => {
  const value = await Value.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  );
  if (!value) throw new AppError(httpStatus.NOT_FOUND, "Value not found");
  return value;
};

export const ValueServices = { getAllByGroup, createValue, updateValue, deleteValue };
