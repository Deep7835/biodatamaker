import { slugMeta, slugParams, SlugView } from "@/views";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("mr");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return slugMeta("mr", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <SlugView lang="mr" slug={(await params).slug} />;
}
