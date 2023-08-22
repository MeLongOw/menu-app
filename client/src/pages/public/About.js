import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { MarkdownAbout } from "src/components/Inputs";
import DOMPurify from "dompurify";

const About = () => {
    const [isEdit, setIsEdit] = useState(false);
    const { about, isEditMode } = useSelector((state) => state.user);
    return about ? (
        <div className="w-full min-h-[90vh]">
            {!isEdit && isEditMode && (
                <div className="mb-5 flex justify-end">
                    <button
                        className="px-4 py-2 rounded-md text-white bg-main min-w-[120px] text-lg font-semibold"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit your information
                    </button>
                </div>
            )}
            {isEdit ? (
                <MarkdownAbout setIsEdit={setIsEdit} />
            ) : (
                <div
                    className="pt-4"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(about),
                    }}
                ></div>
            )}
        </div>
    ) : (
        <div className="flex mt-10 justify-center text-3xl italic font-semibold">
            Nothings to show by this store
        </div>
    );
};

export default memo(About);
