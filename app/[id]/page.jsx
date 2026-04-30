import { notFound } from 'next/navigation';
import ConnectMongoDb from '@/lib/db';
import Post from '@/models/Post';
import PublicPostView from '@/components/posts/PublicPostView';

export default async function PublicPostPage({ params }) {
  await ConnectMongoDb();

  const { id } = await params;

  const post = await Post.findOne({
    shareId: String(id).toUpperCase(),
  }).lean();

  if (!post) {
    notFound();
  }

  return (
    <PublicPostView
      post={{
        shareId: post.shareId,
        content: post.content,
        createdAt: post.createdAt?.toISOString(),
      }}
    />
  );
}