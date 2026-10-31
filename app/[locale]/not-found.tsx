import hr from "@/content/dictionaries/hr";
import en from "@/content/dictionaries/en";
import { NotFoundView } from "@/components/sections/NotFoundView";

export default function NotFound() {
  return <NotFoundView copy={{ hr: hr.notFound, en: en.notFound }} />;
}
