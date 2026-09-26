import { CreateView, createMeta } from "@/views";

export const metadata = createMeta("hi");

export default function Page() {
  return <CreateView lang="hi" />;
}
