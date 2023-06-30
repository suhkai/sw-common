import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";
import type { NonIndexRouteObject } from "react-router-dom";

type ActionFunction = NonIndexRouteObject["action"];

export const action: ActionFunction = async ({ params }) => {
  await deleteContact(params.contactId!);
  return redirect("/");
};
