import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import icons from "src/libs/react-icons/icons";
import { getBase64 } from "src/utils/fileToBase64";
import BackgroundPreview from "./BackgroundPreview";
import defaultBackground from "src/assets/default-background.jpg";

const { BsFillCameraFill } = icons;

const Background = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [src, setSrc] = useState("");
    const { background, isEditMode } = useSelector((state) => state.user);
    const inputRef = useRef();

    const handlePreviewImage = async (file) => {
        const base64Image = await getBase64(file);
        setSrc(base64Image);
        inputRef.current.files = null;
    };

    const handleImgChange = (e) => {
        handlePreviewImage(e.target.files[0]);
        e.target.value = null;
        setModalOpen(true);
    };
    return (
        <div className="w-full aspect-10/3 rounded-b-xl relative overflow-hidden">
            <div className="w-full h-full overflow-hidden">
                <img
                    alt="background"
                    src={background || defaultBackground}
                    className="w-full object-contain"
                />
            </div>
            {isEditMode && (
                <div className="absolute bottom-4 right-4 rounded-xl bg-black opacity-60 hover:opacity-70 z-10">
                    <label
                        className="text-white font-semibold text-lg flex gap-2 items-center p-3 hover:cursor-pointer"
                        htmlFor="background"
                    >
                        <span>
                            <BsFillCameraFill size={24} />
                        </span>
                        <span>Edit your background</span>
                    </label>
                    <input
                        ref={inputRef}
                        id="background"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        hidden
                        onChange={handleImgChange}
                    />
                </div>
            )}
            <BackgroundPreview
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                src={src}
                setSrc={setSrc}
            />
        </div>
    );
};

export default Background;
