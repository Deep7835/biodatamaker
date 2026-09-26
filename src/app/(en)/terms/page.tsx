import { LegalView, legalMeta } from "@/views";

export const metadata = legalMeta("terms");

export default function Page() {
  return <LegalView slug="terms" />;
}
