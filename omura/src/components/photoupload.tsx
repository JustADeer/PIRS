import { useState, useRef } from "react";

interface PhotouploadProps {
  image: any;
}

function Photoupload(props: PhotouploadProps = { image: null }) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebp = (file: File, callback: (webpBlob: Blob) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) callback(blob);
            },
            "image/webp",
            0.9 // WebP quality
          );
        }
      };
      if (e.target?.result) img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      convertToWebp(selectedFile, (webpBlob) => {
        props.image(webpBlob);
      });
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        id="fileInput"
      ></input>
      <div
        className="text-sm w-full h-100 rounded-md bw-white z-10 relative border-2 border-black border-dashed cursor-pointer hover:border-orange-600 bg-gray-100"
        role="button"
        tabIndex={0}
        aria-label="Upload Image"
        onClick={handleDivClick}
      >
        {file ? (
          <img
            draggable="false"
            className="w-full h-full rounded-md relative z-5 p-1 object-cover"
            src={URL.createObjectURL(file)}
          ></img>
        ) : (
          <div className="grid grid-flow-col w-full h-full justify-items-center items-center">
            <img src="src\assets\upload.png" className="w-16 h-16"></img>
          </div>
        )}
      </div>
    </div>
  );
}

export default Photoupload;
