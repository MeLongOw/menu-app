import PropTypes from "prop-types";
import noImage from "src/assets/no-image.png";
import icons from "src/libs/react-icons/icons";
import { formatMoney } from "../../utils/formatMoney";
import { memo, useEffect, useState } from "react";
import { apiDeleteProduct, apiToggleActiveProduct } from "src/libs/axios/apis";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import { getProducts } from "src/libs/redux/menuSlice/asyncThunk";

const { MdDeleteOutline, MdModeEdit, IoEyeSharp } = icons;

const MenuItem = ({ product, onClick = () => {} }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [isActive, setIsActive] = useState(!!product.isActive);
    const { isEditMode } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const handleDeleteItem = async (id) => {
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
                const response = await apiDeleteProduct(id);
                console.log("dede", { response });
                if (response?.success) {
                    Swal.fire("Deleted!", response?.message, "success");
                }
                dispatch(getProducts());
            }
        });
    };

    const handleEditItem = (product) => {
        dispatch(menuSlice.actions.openMenuForm());
        dispatch(menuSlice.actions.setEditProduct(product));
    };

    const handleToggleActiveProduct = async (id) => {
        const response = await apiToggleActiveProduct(id);
        if (response?.success) {
            Swal.fire("success!", response?.message, "success");
            dispatch(getProducts());
        }
    };

    useEffect(() => {
        const { variants } = product;
        const prices = variants
            .map((el) => el.variants.map((_el) => _el.price))
            .flat();
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setIsActive(true);
        } else {
            setIsActive(!!product.isActive);
        }
    }, [isEditMode]);

    return (
        isActive && (
            <div
                className={`relative shadow-lg border-2 rounded-md p-3 group hover:cursor-pointer`}
                onClick={() => onClick(product)}
            >
                <div className={`${!product.isActive && "opacity-20"}`}>
                    <div className="w-full aspect-square mb-2">
                        {product?.images?.length ? (
                            <img
                                src={product?.images[0]?.path}
                                alt="product-card"
                                className="w-full aspect-square object-cover object-center border border-gray-300"
                            />
                        ) : (
                            <img
                                src={noImage}
                                alt="product-card"
                                className="w-full aspect-square object-cover object-center"
                            />
                        )}
                    </div>
                    <div className="capitalize text-lg font-semibold line-clamp-1 mt-3">
                        {product.name}
                    </div>
                    <div className="text-lg font-medium mt-2">
                        {minPrice === maxPrice
                            ? `${formatMoney(minPrice)} VND`
                            : `${formatMoney(minPrice)} - ${formatMoney(
                                  maxPrice
                              )} VND`}
                    </div>
                </div>
                <div className="absolute hidden top-0 left-0 w-full h-full text-white opacity-50 items-center bg-black bg-opacity-50 group-hover:block rounded-md">
                    <div className="flex justify-center items-center h-full">
                        <IoEyeSharp size={40} />
                    </div>
                </div>
                {isEditMode && (
                    <div className="absolute right-[-10px] top-[0] flex translate-y-[-25%] gap-2">
                        <span
                            className={`${
                                product.isActive ? "bg-main" : "bg-gray-500"
                            } rounded-full text-white p-1 hover:cursor-pointer hover:bg-red-500`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActiveProduct(product.id);
                            }}
                        >
                            <IoEyeSharp size={20} />
                        </span>
                        <span
                            className="bg-main rounded-full text-white p-1 hover:cursor-pointer hover:bg-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditItem(product);
                            }}
                        >
                            <MdModeEdit size={20} />
                        </span>
                        <span
                            className="bg-main rounded-full text-white p-1 hover:cursor-pointer hover:bg-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(product.id);
                            }}
                        >
                            <MdDeleteOutline size={20} />
                        </span>
                    </div>
                )}
            </div>
        )
    );
};

MenuItem.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
    }),
    onClick: PropTypes.func,
};

export default memo(MenuItem);
