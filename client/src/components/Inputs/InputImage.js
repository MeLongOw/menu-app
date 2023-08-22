import React, { memo } from "react";
import PropTypes from "prop-types";
import SortableGalley from "../SortableGallery/SortableGallery";
import icons from "src/libs/react-icons/icons";

const { BsFileEarmarkPlus } = icons;
const InputImage = ({
    label,
    multiple,
    register = () => {},
    errors = {},
    id,
    validate,
    previewImages,
    setPreviewImages = () => {},
}) => {
    const handleRemoveImage = (image) => {
        setPreviewImages((prev) => {
            return prev
                .filter((el) => el.order !== image.order)
                .map((el, index) => ({
                    order: index + 1,
                    path: el.path,
                }));
        });
    };
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="max-w-[120px]">
                <div className="border border-gray-800 text-gray-800 max-w-[120px] px-4 py-2 rounded-lg hover:cursor-pointer flex items-center gap-3">
                    <span>
                        <BsFileEarmarkPlus size={20} />
                    </span>
                    <span>{label}</span>
                </div>
            </label>
            <input
                id={id}
                className="hidden"
                type="file"
                multiple={multiple}
                accept="image/x-png,image/gif,image/jpeg"
                {...register(id, validate)}
                // onChange={(e) => {
                //     e.target.value = null;
                // }}
            />
            {errors[id] && (
                <small className="text-xs text-red-500 italic">
                    {errors[id]?.message}
                </small>
            )}
            {!!previewImages?.length && (
                <SortableGalley
                    images={previewImages}
                    setImages={setPreviewImages}
                    handleRemoveImage={handleRemoveImage}
                />
            )}
        </div>
    );
};
InputImage.propTypes = {
    label: PropTypes.string,
    multiple: PropTypes.bool,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    id: PropTypes.string.isRequired,
    validate: PropTypes.object,
    previewImages: PropTypes.array,
    setPreviewImages: PropTypes.func,
};

export default memo(InputImage);
