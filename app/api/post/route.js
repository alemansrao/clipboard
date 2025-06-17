import ConnectMongoDb from "@/lib/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper to check authentication
async function requireAuth(request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return session;
}

// POST: Create a new post
export async function POST(request) {
	const session = await requireAuth(request);
	if (session instanceof NextResponse) return session;

	try {
		const body = await request.json();
		console.log("POST body received:", body);
		const { post_ } = body;
		//generate a unique post_id 4 characters long, UPPERCASE AlPHANUMERIC
		if (post_ && !post_.post_id) {
			post_.post_id = Math.random().toString(36).substring(2, 6).toUpperCase();
		}
		// Always capitalize post_id if present
		if (post_ && post_.post_id) {
			post_.post_id = String(post_.post_id).toUpperCase();
		}



		// Validate required fields as per model
		if (
			!post_ || // Ensure post_ is defined
			!post_.post_id || // required in model
			// !post_.post_title || // required in model
			!post_.post_content ||//required in model
			!post_.user_id // required in model
		) {
			console.error("Invalid post data:", post_);
			return NextResponse.json({ error: "Invalid or missing post data" }, { status: 400 });
		}
		await ConnectMongoDb();

		// Duplicate check: same user, same event_datetime
		const duplicate = await Post.findOne({
			user_id: post_.user_id,
			post_content: post_.post_content,
		});
		if (duplicate) {
			return NextResponse.json(
				{ error: "An post for this content already exists" },
				{ status: 409 }
			);
		}

		const newPost = await Post.create({
			post_id: post_.post_id,
			post_content: post_.post_content,
			favorite: false, // Default to false
			user_id: post_.user_id
		});
		if (!newPost) {
			return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
		}

		return NextResponse.json({ message: "Post created", post: newPost }, { status: 201 });
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
	}
}

// GET: Fetch all posts
export async function GET(request) {
	const session = await requireAuth(request);
	if (session instanceof NextResponse) return session;

	try {
		await ConnectMongoDb();
		const { searchParams } = new URL(request.url);
		const post_id = searchParams.get("post_id");
		const user_id = searchParams.get("user_id");
		console.log("Fetching posts with params:", { post_id, user_id });
		if (post_id) {
			// Always capitalize post_id for search
			const post = await Post.findOne({ post_id: post_id.toUpperCase() });
			if (!post) {
				return NextResponse.json({ error: "Post not found" }, { status: 404 });
			}
			return NextResponse.json(post, { status: 200 });
		}
		if (!user_id) {
			return NextResponse.json({ error: "user_id is required" }, { status: 400 });
		}
		const query = { user_id };
		// Sort: favorite posts first, then by createdAt desc
		const posts = await Post.find(query).sort({ favorite: -1, createdAt: -1 });
		if (!posts || posts.length === 0) {
			return NextResponse.json({ message: "No posts found" }, { status: 404 });
		}
		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
	}
}


// Delete: Delete a post by ID
export async function DELETE(request) {
	const session = await requireAuth(request);
	if (session instanceof NextResponse) return session;

	try {
		const { post_id } = await request.json();
		if (!post_id) {
			return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
		}

		await ConnectMongoDb();
		// Use findByIdAndDelete with MongoDB _id
		const deletedPost = await Post.findByIdAndDelete(post_id);
		if (!deletedPost) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
	}
}

// PUT: Toggle favorite status
export async function PUT(request) {
	const session = await requireAuth(request);
	if (session instanceof NextResponse) return session;

	try {
		const { post_id, favorite, _id } = await request.json();
		// Accept either _id or post_id for update
		if ((!post_id && !_id) || typeof favorite !== "boolean") {
			return NextResponse.json({ error: "post_id or _id and favorite(boolean) required" }, { status: 400 });
		}
		await ConnectMongoDb();
		let updated;
		if (_id) {
			updated = await Post.findByIdAndUpdate(
				_id,
				{ favorite },
				{ new: true }
			);
		} else {
			updated = await Post.findOneAndUpdate(
				{ post_id: post_id.toUpperCase() },
				{ favorite },
				{ new: true }
			);
		}
		if (!updated) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}
		return NextResponse.json({ message: "Favorite status updated", post: updated }, { status: 200 });
	} catch (error) {
		console.error("Error updating favorite:", error);
		return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
	}
}
