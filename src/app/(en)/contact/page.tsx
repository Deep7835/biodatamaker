import { LegalView, legalMeta } from "@/views";

export const metadata = legalMeta("contact");

export default function Page() {
  return <LegalView slug="contact" />;
}
