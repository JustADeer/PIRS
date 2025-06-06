import { motion } from "motion/react";
import { useEffect, useState } from "react";

import API_URL from "./api.tsx";

interface menuInfo {
  forumId: number | null;
  showForum: boolean;
  photoData: string | null;
}

function ForumMenu({ forumId, showForum, photoData }: menuInfo) {
  //const [isMenubarOpen, setIsMenubarOpen] = useState<boolean>(true);
  const [comments, setComments] = useState<object>({});

  const getForum = async () => {
    try {
      const response = await API_URL.get("/getcomments{id}");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //useEffect(() => {
  //  getForum();
  //}, [forumId]);

  if (!photoData) {
    return;
  }

  return (
    <motion.div
      className="bg-white rounded-br-lg rounded-tr-lg absolute z-2 px-4 w-2/11 h-full"
      initial={{ x: -300 }}
      animate={{ x: showForum ? "0%" : "-100%" }}
      transition={{ duration: 0.8, ease: [0.35, 0.17, 0.3, 0.86] }}
    >
      <h1 className="text-center font-bold mb-4">Forums (ID: {forumId})</h1>
      <img
        src={photoData}
        className="bg-gray-200 rounded-xl shadow-2xl border-2 border-gray-300"
      />
      <hr className="h-1 bg-gray-200 my-6 border-0 rounded-full"></hr>
      <div className="">
        <div className="flex flex-row my-4">
          <img
            src="public/vite.svg"
            className="bg-gray-300 rounded-full border-gray-600 border-2 aspect-square w-10 h-10 mt-2"
            draggable={false}
            loading="lazy"
          ></img>
          <div className="ml-4">
            <h2 className="font-bold flex text-black">
              Vite (<p className="text-blue-300">Verified Gov.</p>)
            </h2>
            <p className="text-base/5">
              The pothole should be fixed by the end of the week. Please.
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full rounded-full p-2 border-2 border-dashed hover:border-orange-600 cursor-text"
        ></input>
      </div>
    </motion.div>
  );
}

export default ForumMenu;
