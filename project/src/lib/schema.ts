import { z } from "zod";
import { products, rooms } from "./products";
import { areas } from "./site";

const productNames = products.map((p) => p.name);
const roomNames = rooms.map((r) => r.name);
export const areaOptions = [...areas.map((a) => a.name), "Elsewhere in Essex", "Outside Essex"];
export const productOptions = [...productNames, "Not sure yet — please advise"];
export const roomOptions = [...roomNames, "Whole house", "Conservatory", "Commercial premises"];

export const timeslots = [
  "Weekday morning",
  "Weekday afternoon",
  "Weekday evening",
  "Saturday",
  "Whenever suits you",
] as const;

/**
 * One schema for every enquiry the site sends, shared by the client form and
 * the API route so validation can never drift between them.
 */
export const enquirySchema = z.object({
  kind: z.enum(["survey", "question", "newsletter", "quote"]).default("survey"),

  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(80, "That name is longer than we can store."),

  email: z.email("Please enter a valid email address.").max(160),

  phone: z
    .string()
    .trim()
    .min(9, "Please enter a contact number so we can confirm the appointment.")
    .max(24, "That number looks too long.")
    .regex(/^[0-9+()\s-]+$/, "Please use digits, spaces and + ( ) - only."),

  postcode: z
    .string()
    .trim()
    .min(5, "Please enter your postcode.")
    .max(9)
    .regex(
      /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
      "That does not look like a UK postcode.",
    ),

  area: z.string().min(1, "Please choose the nearest area."),
  product: z.string().min(1, "Please choose a product, or tell us you are unsure."),
  room: z.string().min(1, "Please choose a room."),
  windows: z.coerce
    .number()
    .int("Please enter a whole number.")
    .min(1, "At least one window.")
    .max(80, "For projects this size, please call us directly."),

  timeslot: z.enum(timeslots).default("Whenever suits you"),

  message: z.string().trim().max(1200, "Please keep this under 1200 characters.").optional(),

  consent: z.literal(true, {
    error: "Please confirm we may contact you about your enquiry.",
  }),

  /** Populated only by bots. */
  company: z.string().max(0).optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

/** The newsletter posts to the same endpoint with far fewer fields. */
export const newsletterSchema = z.object({
  kind: z.literal("newsletter"),
  email: z.email("Please enter a valid email address.").max(160),
  name: z.string().max(80).optional(),
});

export const payloadSchema = z.union([enquirySchema, newsletterSchema]);
export type Payload = z.output<typeof payloadSchema>;

export const emptyEnquiry: EnquiryInput = {
  kind: "survey",
  name: "",
  email: "",
  phone: "",
  postcode: "",
  area: "",
  product: "",
  room: "",
  windows: 4,
  timeslot: "Whenever suits you",
  message: "",
  consent: false as unknown as true,
  company: "",
};
