import "../globals.css";
import { RootShell } from "@/views";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="hi">{children}</RootShell>;
}
