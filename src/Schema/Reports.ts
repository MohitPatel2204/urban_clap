import * as Yup from "yup";

export const ReportSchema = Yup.object({
  start_date: Yup.date().required("Start Date Is Required"),
  // .max(new Date(), "Date Can Not Greater To Current Date"),
  end_date: Yup.date()
    .required("End Date Is required")
    .min(Yup.ref("start_date"), "End Date Must Be Greater Than From Date"),
  // .max(new Date(), "Date Can Not Greater To This Day"),
});
