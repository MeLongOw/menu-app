import React, { useState } from "react";
import icons from "src/libs/react-icons/icons";
import noAvatar from "src/assets/no-avatar.png";
import AvatarPreview from "./AvatarPreview";
import { getBase64 } from "src/utils/fileToBase64";
import { useSelector } from "react-redux";

const { BsFillCameraFill } = icons;

const Avatar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [src, setSrc] = useState("");
    const { avatar, isEditMode } = useSelector((state) => state.user);

    const handlePreviewImage = async (file) => {
        const base64Image = await getBase64(file);
        setSrc(base64Image);
    };

    const handleImgChange = (e) => {
        handlePreviewImage(e.target.files[0]);
        e.target.value = null;
        setModalOpen(true);
    };

    return (
        <div>
            <div className="w-[240px] p-1 aspect-square bg-white rounded-full absolute top-0 right-1/2 translate-x-1/2 translate-y-[-50%] flex justify-center items-center">
                <div className="border border-gray-400 w-full aspect-square rounded-full relative">
                    <div className="w-full overflow-hidden rounded-full aspect-square">
                        <img
                            src={avatar || noAvatar}
                            alt="avatar"
                            className="w-full object-cover object-center"
                        />
                    </div>
                    {isEditMode && (
                        <label
                            className="bg-gray-300 rounded-full w-[40px] aspect-square absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-25%] hover:bg-gray-400 hover:cursor-pointer flex items-center justify-center"
                            htmlFor="avatar"
                        >
                            <BsFillCameraFill size={24} />
                            <input
                                id="avatar"
                                type="file"
                                accept="image/x-png,image/gif,image/jpeg"
                                hidden
                                onChange={handleImgChange}
                            />
                        </label>
                    )}
                </div>
            </div>
            <AvatarPreview
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                src={src}
                setSrc={setSrc}
            />
        </div>
    );
};

export default Avatar;
