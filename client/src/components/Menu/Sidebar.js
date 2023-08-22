import {
    apiAddCategory,
    apiDeleteCategory,
    apiEditCategory,
    apiGetCategories,
    apiSortCategory,
} from "src/libs/axios/apis";
import { memo, useEffect, useState } from "react";
import { Link } from "react-scroll";
import icons from "src/libs/react-icons/icons";
import { useForm } from "react-hook-form";
import { InputForm } from "src/components/Inputs";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "src/libs/redux/menuSlice/asyncThunk";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { useParams } from "react-router-dom";

const {
    IoAddCircleOutline,
    BiCheckCircle,
    CiEdit,
    MdDeleteOutline,
    IoCheckmarkSharp,
    IoCloseSharp,
    LiaSaveSolid,
    AiOutlineLoading3Quarters,
} = icons;

const Sidebar = () => {
    const [editingItemId, setEditingItemId] = useState(null);
    const [isAddCategory, setIsAddCategory] = useState(false);
    const { id } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.menu);
    const { isEditMode } = useSelector((state) => state.user);

    const [categoryList, setCategoryList] = useState([]);

    //Add form
    const {
        register: registerAdd,
        formState: fromStateAdd,
        setValue: setValueAdd,
        setFocus: setFocusAdd,
        reset: resetAdd,
        handleSubmit: handleSubmitAdd,
    } = useForm({ defaultValues: { name: "" } });
    const {
        errors: errorsAdd,
        isDirty: isDirtyAdd,
        dirtyFields: dirtyFieldsAdd,
        isSubmitting: isSubmittingAdd,
    } = fromStateAdd;

    //Edit form
    const {
        register: registerEdit,
        formState: fromStateEdit,
        setValue: setValueEdit,
        setFocus: setFocusEdit,
        handleSubmit: handleSubmitEdit,
    } = useForm();
    const {
        errors: errorsEdit,
        isDirty: isDirtyEdit,
        dirtyFields: dirtyFieldsEdit,
        isSubmitting: isSubmittingEdit,
    } = fromStateEdit;

    const fetchCategories = async () => {
        dispatch(getCategories(id));
    };

    const handleDeleteCategory = async (id) => {
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
                const response = await apiDeleteCategory(id);
                console.log("dede", { response });
                if (response?.success) {
                    Swal.fire("Deleted!", response?.message, "success");
                }
                fetchCategories();
            }
        });
    };

    const handleAddCategory = async (data) => {
        const response = await apiAddCategory(data);
        if (response?.success) {
            resetAdd({ name: "" });
            fetchCategories();
        }
    };

    const handleSubmitEditCategory = async (data) => {
        const response = await apiEditCategory(data, editingItemId);
        if (response?.success) {
            fetchCategories();
            setEditingItemId("");
        }
    };

    const onSortEnd = (oldIndex, newIndex) => {
        setCategoryList((array) =>
            arrayMoveImmutable(array, oldIndex, newIndex)
        );
    };

    const handleCancelEditCategory = () => {
        setEditingItemId();
    };

    //
    useEffect(() => {
        if (categories.length) setCategoryList(categories);
    }, [categories]);

    //hande focus when add category
    useEffect(() => {
        if (isAddCategory) {
            setFocusAdd("name");
        }
    }, [isAddCategory, setFocusAdd]);

    //Handle edit category
    useEffect(() => {
        if (editingItemId) {
            setFocusEdit("name");
        }
        const category = categoryList.find(
            (category) => category.id === editingItemId
        );
        if (category) {
            setValueEdit("name", category.name);
        }
    }, [editingItemId]);

    const handleSortCategory = async () => {
        const data = categoryList.map((category, index) => ({
            ...category,
            order: index + 1,
        }));
        console.log({ data });
        await apiSortCategory({ categories: data });
    };
    //handle sort category
    useEffect(() => {
        if (categoryList.length && isEditMode) {
            handleSortCategory();
        }
    }, [categoryList]);

    return (
        <div>
            <div className="sticky top-4">
                <div className=" border-2 shadow-md  border-b-0 rounded-t-lg p-5 flex items-center w-full pb-4 justify-center">
                    <h3 className="font-semibold text-lg">CATEGORY</h3>
                </div>
                <div className="sticky top-4 flex w-[300px] max-h-[calc(100vh-100px)] flex-col gap-2 overflow-y-scroll border-2  p-5 text-lg font-medium rounded-b-lg ">
                    <SortableList
                        onSortEnd={onSortEnd}
                        allowDrag={isEditMode}
                        className="select-none"
                    >
                        {!categoryList.length ?<div className="text-md flex justify-center">There is no category to show</div> :categoryList.map((category) => (
                            <SortableItem key={category.id}>
                                {category?.id === editingItemId ? (
                                    <form
                                        onSubmit={handleSubmitEdit(
                                            handleSubmitEditCategory
                                        )}
                                        className="flex gap-2 pr-3 items-center"
                                    >
                                        <InputForm
                                            register={registerEdit}
                                            id={"name"}
                                            errors={errorsEdit}
                                            placeholder={"Name"}
                                            validate={{
                                                required: "Name is required",
                                            }}
                                        />
                                        {isSubmittingEdit ? (
                                            <span>
                                                <AiOutlineLoading3Quarters className="animate-spin" />
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="hover:cursor-pointer"
                                                    type="submit"
                                                >
                                                    <IoCheckmarkSharp />
                                                </button>
                                                <button
                                                    className="hover:cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelEditCategory();
                                                    }}
                                                >
                                                    <IoCloseSharp />
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                ) : (
                                    <div>
                                        <Link
                                            className={`${
                                                isEditMode
                                                    ? "hover:cursor-grab"
                                                    : "hover:cursor-pointer"
                                            }  p-3 rounded-md flex justify-between hover:bg-gray-200`}
                                            activeClass="text-main"
                                            smooth
                                            spy
                                            to={category.name + category.name}
                                        >
                                            {category?.name}
                                            {isEditMode && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setEditingItemId(
                                                                category?.id
                                                            );
                                                        }}
                                                    >
                                                        <CiEdit />
                                                    </span>
                                                    <span
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteCategory(
                                                                category?.id
                                                            );
                                                        }}
                                                    >
                                                        <MdDeleteOutline />
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                )}
                            </SortableItem>
                        ))}
                    </SortableList>
                    {isAddCategory && isEditMode && (
                        <form
                            onSubmit={handleSubmitAdd(handleAddCategory)}
                            noValidate
                            className="flex gap-2 pr-3 items-center"
                        >
                            <InputForm
                                errors={errorsAdd}
                                register={registerAdd}
                                id={"name"}
                                icon={<BiCheckCircle />}
                                placeholder={"Name"}
                                validate={{ required: "Name is required" }}
                            ></InputForm>
                            {isSubmittingAdd ? (
                                <span>
                                    {
                                        <AiOutlineLoading3Quarters className="animate-spin" />
                                    }
                                </span>
                            ) : (
                                <button
                                    type="submit"
                                    className={`${
                                        isDirtyAdd ? "" : "opacity-25"
                                    }`}
                                >
                                    <LiaSaveSolid />
                                </button>
                            )}
                        </form>
                    )}

                    {isEditMode && (
                        <div
                            onClick={() => {
                                setIsAddCategory(!isAddCategory);
                                setFocusAdd("name");
                            }}
                            className="flex justify-center items-center gap-2 rounded-md p-3 hover:cursor-pointer hover:bg-gray-200"
                        >
                            Add more category
                            <IoAddCircleOutline />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Sidebar);
