import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import API_URL from "../components/api.tsx";

//import report from "./report.tsx";

import { MapContainer, useMapEvents, Marker, Popup } from "react-leaflet";
import { TileLayer } from "react-leaflet/TileLayer";

import { motion } from "motion/react";

import Photoupload from "../components/photoupload.tsx";
//import AddMarker from "../components/addmarker.tsx";
import type { LatLng, LatLngExpression } from "leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import AddMarkers from "../components/addmarker.tsx";
import ForumMenu from "../components/forums.tsx";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

interface LocationMarkerProps {
  onLocationSelect: (latlng: LatLng) => void;
  setIsSidebarOpen: any;
  refreshTrigger: number; // Expect the trigger prop
}

function LocationMarker({
  onLocationSelect,
  refreshTrigger,
  setIsSidebarOpen,
}: LocationMarkerProps) {
  const [position, setPosition] = useState<LatLng | null>(null); // Untuk menyimpan posisi klik
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null); // Untuk menyimpan posisi mouse

  const map = useMapEvents({
    click(e) {
      const new_position = e.latlng;
      setPosition(new_position);
      onLocationSelect(new_position); // Panggil fungsi untuk mengirim posisi ke parent
      // map.locate(); // Jika kamu ingin mendapatkan lokasi pengguna juga
    },
    // locationfound(e) { // Event jika map.locate() berhasil
    //   setPosition(e.latlng);
    //   map.flyTo(e.latlng, map.getZoom());
    // },
    mousemove(e) {
      // Event ketika mouse bergerak di atas peta
      setMousePosition(e.latlng);
    },
  });

  useEffect(() => {
    setPosition(null);
  }, [refreshTrigger]);

  return (
    <>
      {position === null ? null : (
        <Marker position={position}>
          <Popup>
            <div className="bg-white w-50 h-auto">
              You clicked here: <br />
              Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
              <br />
              <button
                className="p-2 rounded-full w-full text-center text-white bg-orange-600 cursor-pointer shadow-lg mt-4 hover:bg-orange-700"
                onClick={() => setIsSidebarOpen(true)}
              >
                Report?
              </button>
            </div>
          </Popup>
        </Marker>
      )}
      {mousePosition && (
        <div className="absolute bottom-5 right-5 p-3 bg-white rounded-full z-400">
          Mouse Lat: {mousePosition.lat.toFixed(4)}, Lng:{" "}
          {mousePosition.lng.toFixed(4)}
        </div>
      )}
    </>
  );
}

// Move addReport outside the App component
const addReport = async (
  photoFile: File | null,
  text: string,
  lat: string,
  lon: string
) => {
  try {
    if (!photoFile) {
      alert("Please select an image file.");
      console.error("No image selected");
      return;
    }
    if (!lat || !lon) {
      alert("Please select a location on the map.");
      console.error("No location selected");
      return;
    }
    if (!text.trim()) {
      alert("Please enter a problem description.");
      console.error("No text description provided");
      return;
    }

    const formData = new FormData();

    formData.append("photo_data", photoFile);
    formData.append("text", text);
    formData.append("latitude", lat);
    formData.append("longitude", lon);

    await API_URL.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error adding report:", error);
  }
};

function App() {
  const position: LatLngExpression = [-6.1693, 106.78857];
  const [inputText, setInputText] = useState("");
  const [selectedMarkerLocation, setSelectedMarkerLocation] =
    useState<LatLng | null>(null);

  const [refreshKey, setRefreshKey] = useState<number>(0); // State to trigger refresh
  const handleRefresh = () => {
    console.log("Refresh button clicked, incrementing key...");
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to force prop change
  };

  const [image, setImage] = useState<any>(null);
  const handleImageUpload = (data: any) => {
    const formData = new FormData();
    formData.append("file", data);
    setImage(data);
  };

  // This function will be called by LocationMarker
  const handleMarkerLocationSelect = (latlng: LatLng) => {
    setSelectedMarkerLocation(latlng);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isForumOpen, setIsForumOpen] = useState<boolean>(false);

  const [forumId, setForumId] = useState<number | null>(null);
  const [photoForum, setPhotoForum] = useState<string | null>(null);

  useEffect(() => {
    if (isForumOpen === true) {
      setIsSidebarOpen(false);
    }
  }, [isForumOpen]);

  useEffect(() => {
    if (isSidebarOpen === true) {
      setIsForumOpen(false);
    }
  }, [isSidebarOpen]);

  return (
    <div className="h-screen flex">
      <motion.div
        className="bg-white rounded-br-lg rounded-tr-lg absolute z-2 px-4 w-2/11 h-full"
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.8, ease: [0.35, 0.17, 0.3, 0.86] }}
      >
        <div className="mt-4 text-center">Response</div>
        <p className="">Photo</p>
        <Photoupload image={handleImageUpload} />
        <p className="mt-4">Comment</p>
        <textarea
          rows={4}
          cols={50}
          className="bg-gray-100 rounded-md w-full p-2 cursor-text border-2 border-black border-dashed hover:border-orange-600"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Comment something about the issue."
        ></textarea>
        <div className="mt-4">
          <p>Latitude: {selectedMarkerLocation?.lat.toFixed(5)}</p>
          <p>Longitude: {selectedMarkerLocation?.lng.toFixed(5)}</p>
        </div>

        <button
          className="p-2 bg-orange-600 rounded-3xl w-full mt-4 text-white hover:bg-orange-700 cursor-pointer"
          onClick={() => {
            if (selectedMarkerLocation) {
              addReport(
                image,
                inputText,
                selectedMarkerLocation.lat.toFixed(5),
                selectedMarkerLocation.lng.toFixed(5)
              );
              handleRefresh();
            } else {
              console.log("Please select a location");
            }
          }}
        >
          Report
        </button>
        <button
          className="absolute top-4 right-4 rounded-full w-8 h-8 bg-gray-200 hover:bg-gray-300 text-xl font-bold cursor-pointer"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          aria-label="Close sidebar"
        >
          X
        </button>
      </motion.div>

      <ForumMenu
        forumId={forumId}
        showForum={isForumOpen}
        photoData={photoForum}
      />

      {localStorage.getItem("acc") === "gov" && (
        <div className="mt-4 text-green-600 font-bold text-center absolute top-2 right-1/2">
          Government Account
        </div>
      )}

      <motion.div
        className="absolute z-2 right-4 top-4 text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <button
          onClick={() => (window.location.href = "/#/")}
          className="cursor-pointer p-2 rounded-2xl bg-white w-20 font-bold text-sm"
        >
          Logout
        </button>
      </motion.div>

      <MapContainer
        center={position}
        zoom={17}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        ></TileLayer>
        <LocationMarker
          onLocationSelect={handleMarkerLocationSelect}
          refreshTrigger={refreshKey}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <AddMarkers
          refreshTrigger={refreshKey}
          setShowForum={setIsForumOpen}
          forumId={setForumId}
          photoData={setPhotoForum}
        />
      </MapContainer>
    </div>
  );
}

export default App;
