import { slugMeta, slugParams, SlugView } from "@/views";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("hi");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return slugMeta("hi", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <SlugView lang="hi" slug={(await params).slug} />;
}
