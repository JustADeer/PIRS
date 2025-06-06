import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

import API_URL from "./api.tsx";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

interface AddMarkersProps {
  refreshTrigger: number; // Expect the trigger prop
  setShowForum: (show: boolean) => void;
  forumId: (id: number) => void;
  photoData: (photo: string) => void;
}

function AddMarkers({
  refreshTrigger,
  setShowForum,
  forumId,
  photoData,
}: AddMarkersProps) {
  const [data, setData] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await API_URL.get("/reports");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMark = async (id: number) => {
    console.log("Deleting id:", id);
    try {
      await API_URL.delete(`/report/${id}`);
      fetchData(); //Update marker after deletion
    } catch (error) {
      console.error("Error deleting mark:", error);
    }
  };

  //Update Markers
  useEffect(() => {
    fetchData();
    console.log(data);
  }, [refreshTrigger]);

  //Failsafe
  if (!data || !Array.isArray(data) || loading) {
    return;
  }

  return (
    <>
      {data &&
        data.map((entry: any) => {
          // Add MIME type prefix if not already present
          const imageSrc = entry.photo_data.startsWith("data:image/")
            ? entry.photo_data
            : `data:image/webp;base64,${entry.photo_data}`;
          return (
            <Marker key={entry.id} position={[entry.latitude, entry.longitude]}>
              <Popup>
                <div className="bg-white w-50 h-auto">
                  <p className="text-center font-bold">ID: {entry.id}</p>
                  <img
                    src={imageSrc}
                    alt="Image Proof"
                    className="h-100% shadow-xl rounded-2xl"
                    draggable="false"
                  />
                  <p className="text-sm text-wrap">{entry.text}</p>
                  <button
                    className="p-2 rounded-full w-full text-center text-white bg-orange-600 cursor-pointer shadow-lg hover:bg-orange-700 mb-2"
                    onClick={() => {
                      setShowForum(true);
                      forumId(entry.id);
                      photoData(imageSrc);
                    }}
                  >
                    Forum
                  </button>

                  {(localStorage.getItem("acc") === "gov" ||
                    localStorage.getItem("acc") === "admin") && (
                    <button
                      className="p-2 rounded-full w-full text-center text-white bg-green-600 cursor-pointer shadow-lg hover:bg-orange-700"
                      onClick={() => deleteMark(entry.id)}
                    >
                      Close Report
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}

export default AddMarkers;
