import { useLocation } from "react-router-dom";
import { brandForPath } from "../data/brands";

/** The brand (company or RADIANCE) for the current route. */
export function useBrand() {
  return brandForPath(useLocation().pathname);
}
