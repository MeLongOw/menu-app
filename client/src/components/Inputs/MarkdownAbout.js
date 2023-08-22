import React, { memo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { apiUpdateAbout } from "src/libs/axios/apis";
import icons from "src/libs/react-icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { useParams } from "react-router-dom";

const { AiOutlineLoading3Quarters } = icons;

const MarkdownAbout = ({ setIsEdit = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const { about } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { storeSlug } = useParams();

    const handleSave = async () => {
        if (editorRef.current) {
            setLoading(true);   
            console.log(editorRef.current.getContent());
            const response = await apiUpdateAbout({
                about: editorRef.current.getContent(),
            });
            if (response?.success) {
                dispatch(getCurrentUser(storeSlug));
                setLoading(false);
                setIsEdit(false);
            }
        }
    };

    const onCancel = () => {
        setIsEdit(false);
    };
    return (
        <>
            {loading ? (
                <div className="flex justify-end gap-3 mb-4">
                    <AiOutlineLoading3Quarters
                        size={40}
                        className="animate-spin"
                    />
                </div>
            ) : (
                <div className="flex justify-end gap-3 mb-4">
                    <button
                        className="px-4 py-2 border rounded-md min-w-[120px] text-lg font-semibold"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-md text-white bg-main min-w-[120px] text-lg font-semibold"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            )}
            <div className="h-full mb-4">
                <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    apiKey={process.env.REACT_APP_MCETINY}
                    initialValue={about}
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
            </div>
        </>
    );
};
export default memo(MarkdownAbout);
