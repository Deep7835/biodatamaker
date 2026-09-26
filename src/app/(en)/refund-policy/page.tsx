import { LegalView, legalMeta } from "@/views";

export const metadata = legalMeta("refund-policy");

export default function Page() {
  return <LegalView slug="refund-policy" />;
}
