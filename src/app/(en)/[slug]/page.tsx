import { slugMeta, slugParams, SlugView } from "@/views";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("en");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return slugMeta("en", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <SlugView lang="en" slug={(await params).slug} />;
}
