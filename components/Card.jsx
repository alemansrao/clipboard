"use client";
import { Card, CardHeader, CardBody, Divider} from "@heroui/react";
import { FaRegTrashAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { addToast } from "@heroui/react";
export function CardComponent({ title, description, onDelete, isFavorite, toggleFavorite,empty = false }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const displayedDescription = showFullDescription ? description : description.slice(0, 100);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
    addToast({
            title: "Content copied to clipboard",
            timeout: 2000,
            shouldShowTimeoutProgress: true,
          });
  };

  return (
    <Card className="w-[400px] h-[150px]">
      <CardHeader className="flex gap-3 justify-between">
        {/* <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        /> */}
        <div className="flex flex-col">
          <p className="text-md cursor-pointer font-bold text-blue-500" onClick={copyToClipboard}>{title}</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Favorite Heart Icon */}
          {!empty && (
            <>
              <span onClick={toggleFavorite} style={{ cursor: "pointer" }}>
                {isFavorite ? <FaHeart color="#fa1e53" size={16} /> : <FaRegHeart color="#fa1e53" size={16} />}
              </span>
              <FaRegTrashAlt
                size={16}
                color="#fa1e53"
                style={{ cursor: "pointer" }}
                onClick={onDelete}
              />
            </>
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>
          {displayedDescription}
          {description.length > 100 && (
            <button onClick={toggleDescription} className="text-blue-500">
              {showFullDescription ? " ...see less" : " ...see more"}
            </button>
          )}
        </p>
      </CardBody>
      {/* <Divider /> */}
      {/* <CardFooter>
        <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
          Visit source code on GitHub.
        </Link>
      </CardFooter> */}
    </Card>
  );
}
