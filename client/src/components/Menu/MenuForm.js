import React, { memo, useEffect, useState } from "react";
import { Modal } from "../Modal";
import { useSelector } from "react-redux";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    InputForm,
    InputImage,
    InputNestedDynamic,
    TextAreaForm,
} from "../Inputs";
import { MainButton } from "../Buttons";
import { useDispatch } from "react-redux";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import Select from "react-select";
import { getBase64 } from "src/utils/fileToBase64";
import { toast } from "react-toastify";
import { apiCreateProduct, apiEditProduct } from "src/libs/axios/apis";
import { getProducts } from "src/libs/redux/menuSlice/asyncThunk";
import icons from "src/libs/react-icons/icons";
import Swal from "sweetalert2";

const {
    IoAddCircleOutline,
    IoIosRemoveCircleOutline,
    AiOutlineLoading3Quarters,
    CiCircleRemove,
} = icons;

const defaultValues = {
    id: "",
    name: "",
    price: "",
    categories: "",
    description: "",
    images: "",
    variants: [{ name: "", variants: [{ name: "", price: "", active: "" }] }],
};

const MenuForm = () => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const dispatch = useDispatch();
    const { isOpenMenuForm, categories, edittingProduct } = useSelector(
        (state) => state.menu
    );
    const [previewImages, setPreviewImages] = useState([]);

    const handlePreviewImages = async (files = []) => {
        const imagesBase64 = [];

        for (let file of files) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                toast.warning("File is not supported");
                return;
            }
            imagesBase64.push({
                path: await getBase64(file),
            });
        }
        setPreviewImages((prev) => {
            const newImages = [...prev, ...imagesBase64].map((el, index) => ({
                order: index + 1,
                path: el.path,
            }));
            return newImages;
        });
    };

    const {
        register,
        reset,
        resetField,
        formState: { errors, isSubmitting },
        watch,
        control,
        handleSubmit,
    } = useForm({
        defaultValues,
    });
    const { fields, append, remove } = useFieldArray({
        name: "variants",
        control,
    });

    const handleSubmitMenuForm = async (data) => {
        const { categories } = data;
        const finalPayload = {
            ...data,
            categories: categories.map((el) => el.value),
            images: previewImages.map((el, index) => ({
                order: index + 1,
                path: el.path,
            })),
            price: +data.price,
            variants: data.variants.map((el) => ({
                ...el,
                variants: el.variants.map((e) => ({ ...e, price: +e.price })),
            })),
        };

        console.log({ finalPayload });

        if (finalPayload.id === 0 || finalPayload.id) {
            const response = await apiEditProduct(
                finalPayload,
                finalPayload.id
            );
            if (response?.success) {
                Swal.fire("Success!", response.message, "success");
                dispatch(getProducts());
                dispatch(menuSlice.actions.closeMenuForm());
                reset(defaultValues);
            }
        } else {
            const response = await apiCreateProduct(finalPayload);
            if (response?.success) {
                Swal.fire("Success!", response.message, "success");
                dispatch(getProducts());
                dispatch(menuSlice.actions.closeMenuForm());
                reset(defaultValues);
            }
        }
    };

    const handleCancelForm = () => {
        dispatch(menuSlice.actions.closeMenuForm());
        if (edittingProduct) {
            dispatch(menuSlice.actions.setEditProduct(null));
        }

        reset(defaultValues);
        setPreviewImages([]);
    };

    //Format category options
    useEffect(() => {
        setCategoryOptions(
            categories.map((category) => {
                return {
                    value: category?.id,
                    label: category?.name,
                };
            })
        );
    }, [categories]);

    //watch image input change
    useEffect(() => {
        if (watch("images")) handlePreviewImages(watch("images"));
    }, [watch("images")]);

    //editting product
    useEffect(() => {
        if (edittingProduct) {
            //format product data
            const formattedProduct = {
                ...edittingProduct,
                categories: edittingProduct.categories.map((el) => ({
                    value: el.id,
                    label: el.name,
                })),
            };

            reset(formattedProduct);
            setPreviewImages(edittingProduct.images);
        }
    }, [edittingProduct]);

    return (
        <Modal isOpen={isOpenMenuForm} onCancel={handleCancelForm}>
            <form
                className=""
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit(handleSubmitMenuForm)}
            >
                <div className="bg-white w-[700px] rounded-xl overflow-hidden">
                    <div className="h-[52px] border-b-2 flex items-center justify-end p-4 text-gray-600">
                        <span>
                            <CiCircleRemove
                                size={32}
                                className="rounded-full hover:cursor-pointer hover:text-gray-800"
                                onClick={handleCancelForm}
                            />
                        </span>
                    </div>
                    <div className="max-h-[632px] overflow-y-scroll p-5 flex flex-col gap-3">
                        <InputForm
                            label="Name"
                            id="name"
                            errors={errors}
                            register={register}
                            validate={{
                                required: "Name is required",
                                maxLength: {
                                    value: 255,
                                    message: "Max length is 255 characters",
                                },
                            }}
                            placeholder="Name"
                        />

                        {/* <InputForm
                            label="Price"
                            id="price"
                            errors={errors}
                            register={register}
                            validate={{
                                required: "Price is required",
                                pattern: {
                                    value: /^[1-9]\d{0,8}$|1000000000$/,
                                    message:
                                        "Number only and under 1.000.000.000",
                                },
                            }}
                            placeholder="Price"
                        /> */}

                        <div className="">
                            <label className="block pb-2">Category</label>
                            <Controller
                                name="categories"
                                control={control}
                                // rules={{ required: "Category is required" }}
                                render={({
                                    field,
                                    fieldState: {
                                        invalid,
                                        isTouched,
                                        isDirty,
                                        error,
                                    },
                                    formState,
                                }) => (
                                    <Select
                                        options={categoryOptions}
                                        {...field}
                                        isMulti
                                    />
                                )}
                            />
                            {errors["categories"]?.message && (
                                <small className="text-xs text-red-500 italic">
                                    {errors["categories"].message}
                                </small>
                            )}
                        </div>

                        <TextAreaForm
                            label="Description"
                            id="description"
                            errors={errors}
                            register={register}
                            validate={{
                                required: "Description is required",
                                maxLength: {
                                    value: 3000,
                                    message:
                                        "Description is limited at 3000 character",
                                },
                            }}
                            placeholder="Description"
                        />
                        {/* INPUT OPTIONS */}
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <label>Option {index + 1}:</label>
                                    <input
                                        className="border flex justify-center items-center gap-2 rounded-md p-3 hover:cursor-pointer"
                                        {...register(`variants.${index}.name`, {
                                            required: "Option name is required",
                                        })}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
                                            className={`${
                                                fields.length <= 1 &&
                                                "opacity-50"
                                            }`}
                                        >
                                            <IoIosRemoveCircleOutline
                                                size={20}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                append({
                                                    name: "",
                                                    variants: [
                                                        { name: "", price: "" },
                                                    ],
                                                })
                                            }
                                        >
                                            <IoAddCircleOutline size={20} />
                                        </button>
                                    </div>
                                    {errors?.variants?.[index]?.name
                                        ?.message && (
                                        <small className="text-xs text-red-500 italic">
                                            {
                                                errors?.variants?.[index]?.name
                                                    ?.message
                                            }
                                        </small>
                                    )}
                                </div>

                                <InputNestedDynamic
                                    parent="variants"
                                    child="variants"
                                    register={register}
                                    nestIndex={index}
                                    childrenFields={["name", "price"]}
                                    control={control}
                                    errors={errors}
                                    validates={[
                                        { required: "Name is required" },
                                        {
                                            required: "Price is required",
                                            pattern: {
                                                value: /^[1-9]\d{0,8}$|1000000000$/,
                                                message:
                                                    "Number only and under 1.000.000.000",
                                            },
                                        },
                                    ]}
                                />
                            </div>
                        ))}

                        <InputImage
                            label="Images"
                            id="images"
                            multiple={true}
                            register={register}
                            errors={errors}
                            watch={watch}
                            previewImages={previewImages}
                            setPreviewImages={setPreviewImages}
                        />
                    </div>

                    <div className="p-4 w-full border-t-2 bottom-0 bg-white">
                        {isSubmitting ? (
                            <div className="flex justify-end gap-4">
                                <span className="animate-spin">
                                    <AiOutlineLoading3Quarters size={32} />
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-4">
                                <MainButton type="submit" name="submit" />
                                <MainButton
                                    name="cancel"
                                    background="bg-white"
                                    border={true}
                                    textColor="text-gray-700"
                                    onClick={handleCancelForm}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default memo(MenuForm);
