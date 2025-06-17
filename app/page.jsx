"use client";
import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  addToast, Divider
} from "@heroui/react";
import { CardComponent } from "@/components/Card";
import NavbarComponent from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({}); // Track favorite state per post
  const { status, data: session } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to /login
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Fetch posts when authenticated and session is ready
  useEffect(() => {
    if (status === "authenticated" && session?.user?.userId) {
      setLoading(true);
      fetch(`/api/post?user_id=${encodeURIComponent(session.user.userId)}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setPosts(Array.isArray(data) ? data : []);
          // Initialize favorites state from DB
          if (Array.isArray(data)) {
            const favMap = {};
            data.forEach((post) => {
              favMap[post._id] = post.favorite;
            });
            setFavorites(favMap);
          }
        })
        .catch(() => {
          setPosts([]);
          setFavorites({});
        })
        .finally(() => setLoading(false));
    }
  }, [status, session?.user?.userId]); // Depend on status and session

  // Add delete handler
  const handleDelete = async (post) => {
    try {
      const res = await fetch("/api/post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post._id }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
        addToast({
          title: "Post deleted",
          timeout: 2000,
          color: "warning",
          shouldShowTimeoutProgress: true,
        });
      } else {
        const data = await res.json();
        addToast({
          title: data.error || "Delete failed",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } catch {
      addToast({
        title: "Error deleting post",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  // Toggle favorite state for a post and update in DB
  const toggleFavorite = async (post) => {
    const newFavorite = !favorites[post._id];
    setFavorites((prev) => ({
      ...prev,
      [post._id]: newFavorite,
    }));
    try {
      const res = await fetch("/api/post", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          _id: post._id,
          favorite: newFavorite,
        }),
      });
      if (!res.ok) {
        // Revert local state if API fails
        setFavorites((prev) => ({
          ...prev,
          [post._id]: !newFavorite,
        }));
        const data = await res.json();
        addToast({
          title: data.error || "Failed to update favorite",
          timeout: 2000,
          color: "danger",
          shouldShowTimeoutProgress: true,
        });
      }
    } catch {
      setFavorites((prev) => ({
        ...prev,
        [post._id]: !newFavorite,
      }));
      addToast({
        title: "Error updating favorite",
        timeout: 2000,
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  };

  if (status === "loading") {
    return (
      <>
        <NavbarComponent />
        <div className="flex-wrap flex gap-3 content-start items-start justify-center min-h-screen">
          <CardComponent title="Loading..." description="Checking authentication..." empty={true} />
        </div>
      </>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <NavbarComponent />

      <div className="flex-wrap flex gap-3 content-start items-start justify-center min-h-screen">
        {loading ? (
          <CardComponent title="Loading..." description="Loading your posts..." />
        ) : posts.length === 0 ? (
          <CardComponent
            title="No posts yet"
            description="There are no posts to display."
            empty={true}
          />
        ) : (
          posts.map((post) => (
            <CardComponent
              key={post._id}
              title={post.post_id}
              description={post.post_content}
              onDelete={() => handleDelete(post)}
              isFavorite={
                favorites.hasOwnProperty(post._id)
                  ? favorites[post._id]
                  : post.favorite
              }
              toggleFavorite={() => toggleFavorite(post)}
            />
          ))
        )}
      </div>
    </>
  );
}


