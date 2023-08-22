import React, { memo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
    apiCreatePost,
    apiUpdateAbout,
    apiUpdatePost,
} from "src/libs/axios/apis";
import icons from "src/libs/react-icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const { AiOutlineLoading3Quarters } = icons;

const MarkdownPost = ({
    isEdit = false,
    edittingId = null,
    setEdittingId = () => {},
    content = "<p>Let write something to your customer</p>",
}) => {
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const { storeSlug } = useParams();

    const handleSave = async () => {
        if (editorRef.current) {
            setLoading(true);
            if (!isEdit) {
                const response = await apiCreatePost({
                    content: editorRef.current.getContent(),
                });
                if (response?.success) {
                    dispatch(getCurrentUser(storeSlug));
                    setLoading(false);
                    setEdittingId(null);
                    Swal.fire("Success!", response.message, "success");
                }
            }
            if (isEdit) {
                const response = await apiUpdatePost(
                    {
                        content: editorRef.current.getContent(),
                    },
                    edittingId
                );
                if (response?.success) {
                    dispatch(getCurrentUser(storeSlug));
                    setLoading(false);
                    setEdittingId(null);
                    Swal.fire("Success!", response.message, "success");
                }
            }
        }
    };

    const onCancel = () => {
        setEdittingId(null);
    };
    return (
        <>
            <div className="h-full flex flex-col gap-4">
                <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    apiKey={process.env.REACT_APP_MCETINY}
                    initialValue={content}
                    init={{
                        height: "100%",
                        menubar: true,
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "preview",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                />
                {loading ? (
                    <div className="flex justify-end gap-3">
                        <AiOutlineLoading3Quarters
                            size={40}
                            className="animate-spin"
                        />
                    </div>
                ) : (
                    <div className="flex justify-end gap-3">
                        {isEdit && (
                            <button
                                className="px-4 py-2 border rounded-md min-w-[120px] text-lg font-semibold"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            className="px-4 py-2 rounded-md text-white bg-main min-w-[120px] text-lg font-semibold"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
export default memo(MarkdownPost);
