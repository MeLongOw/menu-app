import React from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import icons from "src/libs/react-icons/icons";

const { CiCircleRemove } = icons;

export default function SortableGallery({
    images,
    setImages = () => {},
    handleRemoveImage = () => {},
}) {
    const onSortEnd = (oldIndex, newIndex) => {
        setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    };

    return (
        !!images?.length && (
            <SortableList
                onSortEnd={onSortEnd}
                className="grid grid-cols-4 gap-4 select-none z-40"
                draggedItemClassName="z-40"
            >
                {images.map((image, index) => (
                    <SortableItem key={image?.order}>
                        <div className="relative select-none z-40">
                            <div className="aspect-square border-2 overflow-hidden p-1 bg-white border-gray-500 rounded-xl flex hover:cursor-grab select-none">
                                <img
                                    src={image?.path}
                                    alt="preview-product"
                                    className="w-full object-contain rounded-xl select-none"
                                    draggable={false}
                                />
                            </div>
                            <div
                                className="absolute top-0 right-0 translate-x-[25%] translate-y-[-25%] bg-white rounded-full hover:cursor-pointer hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(image);
                                }}
                                onMouseDownCapture={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <CiCircleRemove size={26} />
                            </div>
                        </div>
                    </SortableItem>
                ))}
            </SortableList>
        )
    );
}
