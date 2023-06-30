import type { NonIndexRouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import { updateContact } from "../contacts";

// import type { Contact } from "./contact.helper";
//type LoaderFunction = NonIndexRouteObject["loader"];
type ActionFunction = NonIndexRouteObject["action"];

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  console.log("Edit/action/formData:", formData);
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId!, updates);
  return redirect(`/contacts/${params.contactId}`);
};
