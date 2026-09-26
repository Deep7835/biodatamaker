import { TemplatesView, templatesMeta } from "@/views";

export const metadata = templatesMeta("hi");

export default function Page() {
  return <TemplatesView lang="hi" />;
}
