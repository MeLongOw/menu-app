import React, { useRef, useState } from "react";
import { Modal } from "../Modal";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "@material-tailwind/react";
import noImage from "src/assets/no-image.png";
import { useForm } from "react-hook-form";
import { apiUpdateAvatar } from "src/libs/axios/apis";
import icons from "src/libs/react-icons/icons";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { useParams } from "react-router-dom";
const { AiOutlineLoading3Quarters } = icons;

const AvatarPreview = ({
    modalOpen,
    setModalOpen = () => {},
    src,
    setSrc = () => {},
}) => {
    // modal state
    const [slideValue, setSlideValue] = useState(30);
    const { storeSlug } = useParams();
    const dispatch = useDispatch();
    const cropRef = useRef(null);
    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({ defaultValues: { avatar: "" } });

    const handleCancel = () => {
        setModalOpen(false);
        setSrc("");
    };
    const handleUpdateAvatar = async (data) => {
        console.log(data);
        if (cropRef) {
            const dataUrl = cropRef.current
                .getImage()
                .toDataURL("image/jpeg", 0.7);
            const response = await apiUpdateAvatar({ avatar: dataUrl });
            if (response?.success) {
                dispatch(getCurrentUser(storeSlug));
                setModalOpen(false);
            }
        }
    };

    return (
        <div>
            <Modal isOpen={modalOpen} onCancel={handleCancel}>
                <form
                    className="flex w-[500px] bg-white flex-col gap-4 rounded-xl p-5"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onSubmit={handleSubmit(handleUpdateAvatar)}
                >
                    <div className="flex justify-center">
                        <div className="w-[70%] aspect-square">
                            <AvatarEditor
                                ref={cropRef}
                                image={src || noImage}
                                style={{ width: "100%", height: "100%" }}
                                border={50}
                                borderRadius={150}
                                color={[0, 0, 0, 0.72]}
                                scale={1 + slideValue / 100}
                                rotate={0}
                            />
                        </div>
                    </div>
                    <Slider
                        min={0}
                        defaultValue={slideValue}
                        onChange={(e) => setSlideValue(e.target.value)}
                        max={100}
                    />
                    {isSubmitting ? (
                        <div className="flex justify-end gap-3">
                            <AiOutlineLoading3Quarters
                                size={30}
                                className="animate-spin"
                            />
                        </div>
                    ) : (
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="border-2 px-4 py-2 text-lg font-semibold rounded-lg text-gray-700 min-w-[100px] hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="border px-4 py-2 text-lg font-semibold text-white bg-main rounded-lg min-w-[100px]"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
};

export default AvatarPreview;
