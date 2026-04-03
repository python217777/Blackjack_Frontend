import { useEffect, useState } from "react";

export function useQueryParams() {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    setQueryParams(new URLSearchParams(window.location.search));
  }, []);

  return queryParams;
}
