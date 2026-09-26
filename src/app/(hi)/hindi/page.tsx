import { HomeView, homeMeta } from "@/views";

export const metadata = homeMeta("hi");

export default function Page() {
  return <HomeView lang="hi" />;
}
