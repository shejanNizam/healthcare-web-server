import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { createNotification } from "../notification/notification.service";
import { Contact } from "./contact.model";

const createContact = async (payload: { name: string; email: string; description: string }) => {
  const contact = await Contact.create(payload);

  await createNotification({
    title: "New Contact Message",
    message: `${payload.name} (${payload.email}) sent a contact message.`,
    type: "new_contact",
    referenceType: "contact",
    referenceId: String(contact._id),
  });

  return contact;
};

const getAllContacts = async (query: Record<string, string>) => {
  const baseQuery = Contact.find({ isDeleted: false });
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.search(["name", "email"]).sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const getSingleContact = async (id: string) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status: "read" },
    { returnDocument: "after" },
  );
  if (!contact) throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  return contact;
};

export const ContactServices = { createContact, getAllContacts, getSingleContact };
