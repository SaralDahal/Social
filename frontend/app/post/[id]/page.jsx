import { PostDetailContent } from "@/components/post-detail-content";

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  return <PostDetailContent id={id} />;
}
