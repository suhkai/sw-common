import type { NonIndexRouteObject } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

const contactExample = {
  first: "Your",
  last: "Name",
  avatar: "https://placekitten.com/g/200/200",
  twitter: "your_handle",
  notes: "Some notes",
  favorite: true,
};

export type Contact = typeof contactExample;

type LoaderFunction = NonIndexRouteObject["loader"];
type ActionFunction = NonIndexRouteObject["action"];

export const loader: LoaderFunction = async ({ params }) => {
  const contact = await getContact(params.contactId!);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not found",
    });
  }
  return { contact };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  return updateContact(params.contactId!, {
    favorite: formData.get("favorite") === "true",
  });
};
