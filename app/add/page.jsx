"use client";
import React, { useState } from "react";
import {
	Button,
	useDisclosure,
	addToast
} from "@heroui/react";
import NavbarComponent from "@/components/Navbar";
import { Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function App() {
	const [text, setText] = useState("");
	const { status, data: session } = useSession();
	const router = useRouter();

	// Redirect unauthenticated users to /login
	React.useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<span>Loading...</span>
			</div>
		);
	}

	if (status !== "authenticated") {
		return null;
	}

	const pasteFromClipboard = async () => {
		try {
			const clipboardText = await navigator.clipboard.readText();
			setText(clipboardText);
			// Pass clipboardText directly to handleUpload
			handleUpload(clipboardText);
		} catch (err) {
			// Optionally handle error
			addToast({
				title: "Error pasting from clipboard",
				// description: "Toast Description",
				color: "danger",
				timeout: 2000,
				shouldShowTimeoutProgress: true,
			});
		}
	};

	// Accept optional content argument
	const handleUpload = async (content) => {
		try {
			const postContent = typeof content === "string" ? content : text;
			const userId = session?.user?.userId; // get user id from session
			if (!userId) {
				addToast({
					title: "User not authenticated",
					color: "danger",
					timeout: 2000,
					shouldShowTimeoutProgress: true,
				});
				return;
			}
			const res = await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					post_: {
						// post_title: title,
						post_content: postContent,
						user_id: userId // use logged-in user id
					}
				})
			});
			const data = await res.json();
			if (res.ok) {
				setText("");
				// setTitle("");
				addToast({
					title: "Post uploaded",
					color: "success",
					timeout: 2000,
					shouldShowTimeoutProgress: true,
				});
				//re-route to home page useRouter 
				router.push("/");


			} else {
				addToast({
					title: data.error || "Upload failed",
					color: "danger",
					timeout: 2000,
					shouldShowTimeoutProgress: true,
				});
			}
		} catch (err) {
			addToast({
				title: "Error uploading post",
				color: "danger",
				timeout: 2000,
				shouldShowTimeoutProgress: true,
			});
		}
	};

	return (
		<>
			<NavbarComponent />
			<div className="flex gap-3 justify-center min-h-screen">
				<div className="flex flex-col gap-4 p-8 w-full ">
					{/* <Input label="Title" type="text" required value={title} onChange={e => setTitle(e.target.value)} /> */}
					<Textarea
						placeholder="Type or paste your text here..."
						value={text}
						required
						onChange={e => setText(e.target.value)}
						minRows={10}
					/>
					<div className="flex gap-2 justify-center">
						<Button color="secondary" onPress={pasteFromClipboard}>
							Paste from Clipboard
						</Button>
						<Button color="primary" onPress={() => handleUpload()} disabled={!text}>
							Upload
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}


