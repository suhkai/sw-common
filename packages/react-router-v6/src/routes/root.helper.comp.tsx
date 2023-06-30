import { useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError() as { status: number, statusText: string, data:'' };
  //console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!!{error.status} {error.statusText}, {error.data}</div>;
}
