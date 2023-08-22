import DOMPurify from "dompurify";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MarkdownPost } from "src/components/Inputs";
import { timeSince } from "src/utils/timeSince";
import icons from "src/libs/react-icons/icons";
import noAvatar from "src/assets/no-avatar.png";
import { apiDeletPost } from "src/libs/axios/apis";
import Swal from "sweetalert2";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { useParams } from "react-router-dom";

const { MdDeleteOutline, MdModeEdit } = icons;

const Post = () => {
    const { isEditMode, posts, name, avatar } = useSelector(
        (state) => state.user
    );

    const [edittingId, setEdittingId] = useState(null);
    const dispatch = useDispatch();
    const { storeSlug } = useParams();

    const handleDeletePost = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeletPost(id);
                if (response?.success) {
                    dispatch(getCurrentUser(storeSlug));
                    Swal.fire("Deleted!", response.message, "success");
                }
            }
        });
    };

    return (
        <div>
            {isEditMode && (
                <div className="h-[90vh] w-full border shadow-md rounded-xl p-5">
                    <MarkdownPost />
                </div>
            )}
            <div className="my-4 flex flex-col gap-4">
                {posts.length ? (
                    posts.map((post) => (
                        <div key={post.id} className="relative">
                            <div className="min-h-[120px] w-full border shadow-md rounded-xl p-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[48px] aspect-square rounded-full border border-gray-400 overflow-hidden">
                                        <img
                                            src={avatar || noAvatar}
                                            alt="avatar"
                                            className="w-full aspect-square object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">
                                            {name}
                                        </div>
                                        <div>{timeSince(post.createdAt)}</div>
                                    </div>
                                </div>
                                {edittingId !== post.id ? (
                                    <div
                                        className="pt-4"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                post.content
                                            ),
                                        }}
                                    ></div>
                                ) : (
                                    <div className="h-[90vh] w-full border shadow-md rounded-xl p-5">
                                        <MarkdownPost
                                            content={post.content}
                                            setEdittingId={setEdittingId}
                                            edittingId={edittingId}
                                            isEdit={true}
                                        />
                                    </div>
                                )}
                            </div>
                            {isEditMode && (
                                <div className="absolute right-[-10px] top-[0] flex translate-y-[-25%] gap-2">
                                    <span
                                        className="bg-main rounded-full text-white p-1 hover:cursor-pointer hover:bg-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEdittingId(post.id);
                                        }}
                                    >
                                        <MdModeEdit size={20} />
                                    </span>
                                    <span
                                        className="bg-main rounded-full text-white p-1 hover:cursor-pointer hover:bg-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePost(post.id);
                                        }}
                                    >
                                        <MdDeleteOutline size={20} />
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex mt-10 justify-center text-3xl italic font-semibold">
                        No post has been written by this store
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Post);
