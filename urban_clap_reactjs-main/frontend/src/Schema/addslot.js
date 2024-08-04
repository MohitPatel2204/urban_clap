import * as Yup from "yup";

export const ValidationSchemaSlot = Yup.object({
  slot: Yup.string().required("Name Required"),
});
