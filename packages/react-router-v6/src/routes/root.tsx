import { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  useNavigation,
  useSubmit,
  useSearchParams,
} from "react-router-dom";

export default function Root() {
  const { contacts = [], q = "" } = (useLoaderData() ?? {}) as {
    q: string | null;
    contacts: { id: string; favorite: boolean; [index: string]: unknown }[];
  };

  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState(q);

  if (navigation.state === "idle") {
    console.log("idle/contacts");
  }
  if (navigation.state === "loading") {
    console.log("loading/contacts=");
  }
  if (navigation.state === "submitting") {
    console.log("submitting/contacts=");
  }

  const [usp, setUSP] = useSearchParams();
  const isFirstSearch = q === null;
  console.log("isFirstSearch", isFirstSearch);

  const searching = usp.get("q") && navigation.location;
  console.log("navigation.location", navigation.location);
  console.log("use-search-params", usp.get("q"));

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              className={searching ? "loading" : "loading"}
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              value={searchValue as string}
              defaultValue={q ?? ""}
              onChange={(e) => {
                const cleaned = e.target.value.trim();
                const v = cleaned ? cleaned : null;
                setSearchValue(v);

                // form has native web submit function "submit", no submit event is raised though and no validation checks performed
                // "react-router submit" does some serialization and submits the data
                //if (cleaned){
                if (cleaned) {
                  submit(e.currentTarget.form, { replace: !isFirstSearch });
                  setUSP({ q: cleaned });
                } else {
                  setUSP({});
                }
                //}
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : "--"
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
