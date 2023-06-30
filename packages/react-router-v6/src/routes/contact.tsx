import { Form, useLoaderData, useFetcher } from "react-router-dom";

import type { Contact } from "./contact.helper";

export default function Contact() {
  //
  const { contact } = (useLoaderData() ?? {}) as { contact: Contact };

  return (
    <div id="contact">
      <div>
        {contact?.avatar && <img key={contact.avatar} src={contact.avatar} />}
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact?.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact?.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite(props: { contact: Contact }) {
  const fetcher = useFetcher();
  let favorite = props?.contact?.favorite; // passed
  // adjust if there is an actual update IN PROGRESS
  // Regardless if the submut fails/succeeeds, the property contact.favorite will be true or false,
  // there there is a re-paint on success because props altered (not "contact", but "{ contact }")
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
