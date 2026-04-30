import { NextResponse } from 'next/server';
import ConnectMongoDb from '@/lib/db';
import { requireUserSession } from '@/lib/session';
import { createShareId } from '@/lib/ids';
import { validatePostContent } from '@/lib/validators';
import Post from '@/models/Post';
export async function GET() {
  try {
    const session = await requireUserSession();
    await ConnectMongoDb();

    const posts = await Post.find({ ownerId: session.user.userId })
      .sort({ favorite: -1, createdAt: -1 })
      .lean();

    const normalizedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString()
    }));

    return NextResponse.json(normalizedPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await requireUserSession();
    const body = await request.json();
    const content = validatePostContent(body?.content);

    await ConnectMongoDb();

    let shareId = '';
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = createShareId();
      const existing = await Post.exists({ shareId: candidate });
      if (!existing) {
        shareId = candidate;
        break;
      }
    }

    if (!shareId) {
      throw new Error('Unable to generate a unique share id.');
    }

    const post = await Post.create({
      shareId,
      content,
      ownerId: session.user.userId,
      favorite: false
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : error.message.startsWith('Invalid') ? 400 : 500;
    return NextResponse.json({ error: error.message || 'Unable to create post.' }, { status });
  }
}
