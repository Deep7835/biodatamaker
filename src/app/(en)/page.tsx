import { HomeView, homeMeta } from "@/views";

export const metadata = homeMeta("en");

export default function Page() {
  return <HomeView lang="en" />;
}
