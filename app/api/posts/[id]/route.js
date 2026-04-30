import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ConnectMongoDb from '@/lib/db';
import { requireUserSession } from '@/lib/session';
import { validateFavoriteFlag } from '@/lib/validators';
import Post from '@/models/Post';

export async function GET(_request, { params }) {
  try {
    await ConnectMongoDb();
    const { id } = await params;
    const shareId = String(id).toUpperCase();

    const post = await Post.findOne({ shareId }).lean();
    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        shareId: post.shareId,
        content: post.content,
        createdAt: post.createdAt,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Unable to fetch post.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
    }

    const session = await requireUserSession();
    await ConnectMongoDb();

    const deletedPost = await Post.findOneAndDelete({
      _id: id,
      ownerId: session.user.userId,
    });

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to delete post.' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
    }

    const session = await requireUserSession();
    const body = await request.json();
    const favorite = validateFavoriteFlag(body?.favorite);
    await ConnectMongoDb();

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, ownerId: session.user.userId },
      { favorite },
      { new: true }
    ).lean();

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json(
      { ...updatedPost, _id: updatedPost._id.toString() },
      { status: 200 }
    );
  } catch (error) {
    const status =
      error.message === 'Unauthorized'
        ? 401
        : error.message.startsWith('Invalid')
        ? 400
        : 500;

    return NextResponse.json(
      { error: error.message || 'Unable to update post.' },
      { status }
    );
  }
}