import type { NonIndexRouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import { getContacts, createContact } from "../contacts";

type LoaderFunction = NonIndexRouteObject["loader"];
type ActionFunction = NonIndexRouteObject["action"];

export const loader: LoaderFunction = async ({ request, params }) => {
  // the routloader doesnt really care about params, we load everything
  console.log("rootloader: params on entry:", params);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
};

export const action: ActionFunction = async () => {
  const contact = await createContact();
  console.log("rootaction: creating contact", contact);
  return redirect(`/contacts/${contact.id}/edit`);
};
