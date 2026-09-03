import { redirect } from "next/navigation";

/**
 * The catalogue lives on the home page.
 *
 * There used to be a gallery here *and* a grid on the home page *and* a
 * collections list — three surfaces showing the same twelve designs, which is
 * most of what made the site feel repetitive. This redirect keeps every link
 * and bookmark to `/templates` working while there is only one catalogue.
 */
export default function TemplatesIndex() {
  redirect("/#designs");
}
