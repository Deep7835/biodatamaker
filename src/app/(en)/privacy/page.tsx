import { LegalView, legalMeta } from "@/views";

export const metadata = legalMeta("privacy");

export default function Page() {
  return <LegalView slug="privacy" />;
}
