import React, { memo, useEffect, useState } from "react";
import { Modal } from "../Modal";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import { MainButton } from "../Buttons";
import { formatMoney } from "src/utils/formatMoney";
import { useForm } from "react-hook-form";
import { InputNumberWithForm } from "../Inputs";
import { Carousel } from "@material-tailwind/react";
import noImage from "src/assets/no-image.png";
import icons from "src/libs/react-icons/icons";
import { guestSlice } from "src/libs/redux/guestSlice/guestSlice";
import Swal from "sweetalert2";

const { CiCircleRemove } = icons;

const MenuDetailItem = ({ product, setProduct = () => {} }) => {
    const [variantNames, setVariantNames] = useState(
        product.variants.map((el) => el.name)
    );
    const [price, setPrice] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    const dispatch = useDispatch();
    const { isOpenMenuDetail } = useSelector((state) => state.menu);
    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm({ defaultValues: { qty: "1" } });

    const handleAddToCart = (data) => {
        const { qty, ...restData } = data;
        const { id, name, images, variants } = product;
        const finalData = {
            ...restData,
            qty: +qty,
            product: { id, name, images, variants },
            price,
        };
        dispatch(guestSlice.actions.addToCart(finalData));
        dispatch(menuSlice.actions.closeMenuDetailItem());
        setProduct(null);
        Swal.fire("Success!", "Add to cart successfully!", "success");
    };
    useEffect(() => {
        // const variantNames = product.variants.map((el) => el.name);
        let maxPrice = 0;
        for (let variantName of variantNames) {
            const variant = product.variants.filter(
                (el) => el.name === variantName
            );

            const subVariant = variant[0].variants.filter(
                (el) => el.name === watch(variantName)
            );
            if (subVariant[0]?.price && maxPrice <= subVariant[0]?.price) {
                maxPrice = subVariant[0]?.price;
            }
        }
        setPrice(maxPrice);
    }, [...variantNames.map((el) => watch(el))]);

    useEffect(() => {
        setSubTotal(price * +watch("qty"));
    }, [watch("qty"), price]);
    return (
        <Modal
            isOpen={isOpenMenuDetail}
            onCancel={() => {
                setProduct(null);
                dispatch(menuSlice.actions.closeMenuDetailItem());
                reset();
            }}
        >
            <div>
                <div className="h-[60px] bg-white rounded-t-xl border-b border-gray-800 flex justify-end items-center px-4 hover:cursor-pointer">
                    <CiCircleRemove
                        size={36}
                        onClick={() => {
                            dispatch(menuSlice.actions.closeMenuDetailItem());
                            reset();
                        }}
                    />
                </div>
                <form
                    onClick={(e) => e.stopPropagation()}
                    className="w-[700px]"
                    onSubmit={handleSubmit(handleAddToCart)}
                >
                    <div className="max-h-[680px] bg-white p-5 overflow-y-scroll">
                        {product.images.length ? (
                            <Carousel className="rounded-xl">
                                {product.images.map((image) => (
                                    <img
                                        key={image.order}
                                        src={image.path}
                                        alt="product"
                                        className="w-full aspect-square object-cover rounded-xl border border-gray-300"
                                    />
                                ))}
                            </Carousel>
                        ) : (
                            <img
                                alt="product"
                                src={noImage}
                                className="w-full aspect-square object-cover rounded-xl"
                            />
                        )}
                        <div className="text-lg font-semibold flex flex-col items-center capitalize mt-4">
                            <span className="text-2xl">{product.name}</span>
                        </div>
                        <div>
                            <span className="text-base font-semibold">
                                {"Description: "}
                            </span>
                            <span>{product.description}</span>
                        </div>
                        {product.variants.map((variant) => (
                            <div key={variant.name}>
                                <span className="text-lg font-semibold flex gap-3 items-center">
                                    <span>{variant?.name}:</span>
                                    {errors[variant?.name] && (
                                        <i className="text-red-600 text-sm">
                                            ({errors[variant?.name].message})
                                        </i>
                                    )}
                                </span>
                                <div
                                    className={`grid grid-cols-4 grid-rows-${Math.round(
                                        variant.variants.length / 4
                                    )} gap-2`}
                                >
                                    {variant.variants.map(
                                        (item, index, all) => {
                                            const checkIndex = all.findIndex(
                                                (el) => el.active
                                            );
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="select-none"
                                                >
                                                    {!!item.active && (
                                                        <input
                                                            id={item.name}
                                                            type="radio"
                                                            value={item.name}
                                                            {...register(
                                                                variant.name,
                                                                {
                                                                    required:
                                                                        "Select one",
                                                                }
                                                            )}
                                                            hidden
                                                            className="peer"
                                                            defaultChecked={
                                                                checkIndex ===
                                                                index
                                                            }
                                                        />
                                                    )}
                                                    <label
                                                        className={`flex h-full rounded-lg items-center justify-center border-2 py-3 px-4 text-center border-gray-400
                                                ${
                                                    !item.active
                                                        ? "opacity-60"
                                                        : "hover:cursor-pointer hover:bg-gray-300 "
                                                }            
                                                peer-checked:border-red-600 peer-checked:hover:bg-inherit`}
                                                        htmlFor={item.name}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-800 bg-white rounded-b-xl h-[80px] px-4">
                        <InputNumberWithForm
                            register={register}
                            id="qty"
                            label="quantity"
                            setValue={setValue}
                            watch={watch}
                        />
                        <div className="flex items-center">
                            <span className="text-xl font-semibold">
                                {`${formatMoney(subTotal)} VND`}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <MainButton name="Add to cart" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
MenuDetailItem.propTypes = {
    product: PropTypes.object,
};

export default memo(MenuDetailItem);
