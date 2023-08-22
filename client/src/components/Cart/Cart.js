import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import noImage from "src/assets/no-image.png";
import icons from "src/libs/react-icons/icons";
import { formatMoney } from "src/utils/formatMoney";
import { guestSlice } from "src/libs/redux/guestSlice/guestSlice";
import { InputNumberCart } from "../Inputs";
import { useNavigate, useParams } from "react-router-dom";

const { CiCircleRemove, AiOutlineArrowRight } = icons;

const Cart = () => {
    const [subTotal, setSubTotal] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isCartOpen } = useSelector((state) => state.menu);
    const { cart } = useSelector((state) => state.guest);
    console.log({ cart });
    const { storeSlug } = useParams();
    const handleToggleCart = () => {
        dispatch(menuSlice.actions.toggleCart());
    };
    useEffect(() => {
        setSubTotal(
            cart.reduce((total, el) => {
                return (total += el.qty * el.price);
            }, 0)
        );
    }, [cart]);

    const handleRemoveCart = (index) => {
        dispatch(guestSlice.actions.removeFromCart(index));
    };

    const handleCheckOut = () => {
        dispatch(menuSlice.actions.toggleCart());
        navigate(`/${storeSlug}/checkout`);
    };

    return (
        <>
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={handleToggleCart}
                ></div>
            )}
            <input
                type="checkbox"
                checked={isCartOpen}
                className="relative sr-only peer"
                readOnly
            />
            <div className="fixed top-0 right-0 z-20 w-[400px] h-full p-6 flex flex-col transition-all duration-500 transform translate-x-full bg-white shadow-lg peer-checked:translate-x-0">
                <div className="w-full pb-5 border-b border-gray-500 flex justify-between items-center">
                    <span className="text-xl font-semibold">YOUR CART</span>
                    <span>
                        <CiCircleRemove
                            size={24}
                            onClick={handleToggleCart}
                            className="hover:cursor-pointer"
                        />
                    </span>
                </div>
                <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-4">
                    {!cart.length && (
                        <div className="font-medium text-lg italic">
                            Your cart is empty...
                        </div>
                    )}
                    {cart.map(({ product, price, qty, ...variants }, index) => (
                        <div
                            key={index}
                            className="flex gap-3 relative items-center p-2 border border-gray-300 rounded-lg mr-3"
                        >
                            <img
                                src={product?.images[0]?.path || noImage}
                                alt="cart-item"
                                className="w-[88px] aspect-square object-contain border border-gray-500 rounded-lg"
                            />
                            <div className="flex flex-col gap-1">
                                <div className="text-lg font-semibold">{`${product.name}`}</div>
                                <div className="flex flex-wrap italic gap-1">
                                    {Object.entries(variants).map((el) => (
                                        <div
                                            className="text-xs"
                                            key={el[0] + el[1]}
                                        >
                                            {`- ${el[1]}`}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-md font-semibold">{`${formatMoney(
                                    +price * +qty
                                )} VND`}</div>
                                <div>
                                    <InputNumberCart
                                        itemIndex={index}
                                        qty={qty}
                                    />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] hover:text-main hover:cursor-pointer">
                                <CiCircleRemove
                                    size={20}
                                    onClick={() => handleRemoveCart(index)}
                                    className="bg-white text-gray-600 hover:text-main"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full pt-5 border-t border-gray-500 flex justify-between items-center flex-col gap-4">
                    <div className="w-full text-xl font-semibold flex justify-between">
                        <span>SUBTOTAL</span>
                        <span>{`${formatMoney(subTotal)} VND`}</span>
                    </div>
                    <div className="w-full">
                        <button
                            className="py-3 w-full bg-main text-xl font-semibold text-white flex justify-center items-center gap-4"
                            onClick={handleCheckOut}
                            disabled={!cart.length}
                        >
                            <span>CHECK OUT</span>
                            <span>
                                <AiOutlineArrowRight size={24} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
