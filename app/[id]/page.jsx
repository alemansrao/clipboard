"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CardComponent } from "@/components/Card";
import NavbarComponent from "@/components/Navbar";
import { useSession } from "next-auth/react";
export default function PostDetailPage() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { status, data: session } = useSession();
	// // Redirect unauthenticated users to /login
	// useEffect(() => {
	// 	if (status === "unauthenticated") {
	// 		router.replace("/login");
	// 	}
	// }, [status, router]);

	useEffect(() => {
		// if (!id || status !== "authenticated") return;
		// Capitalize the id before using in fetch
		const capitalizedId = String(id).toUpperCase();
		fetch(`/api/post?post_id=${capitalizedId}`)
			.then(res => res.ok ? res.json() : null)
			.then(data => {
				if (Array.isArray(data) && data.length > 0) {
					setPost(data[0]);
				} else if (data && data.post_id) {
					setPost(data);
				} else {
					setPost(null);
				}
				setLoading(false);
			})
			.catch(() => {
				setPost(null);
				setLoading(false);
			});
	}, []);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<span>Loading...</span>
			</div>
		);
	}

	// if (status !== "authenticated") {
	// 	return null;
	// }

	return (
		<>
			<NavbarComponent />
			<div className="flex flex-col items-center justify-start min-h-screen">
				{loading ? (
					<div>Loading...</div>
				) : !post ? (
					<div className="text-red-500 font-bold">Post not found</div>
				) : (
					<div className="max-w-xl w-full flex justify-center">
						<CardComponent
							title={post.post_id}
							description={post.post_content}
							empty={true}
						/>
					</div>
				)}
			</div>
		</>
	);
}
