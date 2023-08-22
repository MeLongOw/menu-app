import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "src/assets/no-image.png";
import { InputForm, TextAreaForm } from "src/components/Inputs";
import { formatMoney } from "src/utils/formatMoney";
import noAvatar from "src/assets/no-avatar.png";
import { apiCheckOrderStatus, apiCreateOrder } from "src/libs/axios/apis";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { guestSlice } from "src/libs/redux/guestSlice/guestSlice";
import Swal from "sweetalert2";
import icons from "src/libs/react-icons/icons";
import { CheckoutStepper } from "src/components/Stepper/CheckoutStepper";
const { AiOutlineLoading3Quarters } = icons;

const Checkout = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [step, setStep] = useState(0);
    console.log({ step });
    const [orderId, setOrderId] = useState();
    const { cart } = useSelector((state) => state.guest);
    const {
        register,
        reset,
        resetField,
        formState: { errors, isSubmitting },
        watch,
        control,
        handleSubmit,
    } = useForm({ defaultValues: { name: "", phone: "", note: "" } });
    const { avatar, name, id } = useSelector((state) => state.user);
    const { phone, name: guestName } = useSelector((state) => state.guest);
    const { storeSlug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOrder = async (data) => {
        dispatch(
            guestSlice.actions.setGuestNameAndPhone({
                name: data.name,
                phone: data.phone,
            })
        );
        const payload = cart.map(
            ({
                product: { id, variants },
                qty,
                price,
                ...selectedVariants
            }) => {
                const selectedVariantValues = Object.values(selectedVariants);
                return {
                    product: {
                        id,
                        variants: variants.map((el) => ({
                            id: el.id,
                            subVariant: el.variants.find((variant) =>
                                selectedVariantValues.some(
                                    (e) => e === variant.name
                                )
                            ).id,
                        })),
                    },
                    qty,
                };
            }
        );

        const finalPayload = { cart: payload, ...data, id };

        const response = await apiCreateOrder(finalPayload);
        if (response?.success) {
            setStep(1);
            setOrderId(response.order.id);
            Swal.fire("Success!", response.message, "success");
        } else {
            Swal.fire("Fail!", response.message, "error");
        }
    };
    const handleBack = () => {
        navigate("/" + storeSlug);
    };

    const checkOrderStatus = async () => {
        const response = await apiCheckOrderStatus(orderId);
        if (response?.success) {
            if (response.status === "accepted") {
                setStep(2);
                Swal.fire(
                    "Success!",
                    "Your order have been accepted",
                    "success"
                );
            }
            if (response.status === "success") {
                setStep(3);
                Swal.fire(
                    "Success!",
                    "Your order have been successful",
                    "success"
                );
            }
            if (response.status === "cancelled") {
                setStep(0);
                Swal.fire(
                    "Fail!",
                    "Your order have been cancelled by " + name,
                    "error"
                );
            }
        }
    };

    useEffect(() => {
        dispatch(getCurrentUser(storeSlug));
        setSubTotal(
            cart.reduce((total, el) => {
                return (total += el.qty * el.price);
            }, 0)
        );
    }, [cart]);

    useEffect(() => {
        reset({ name: guestName, phone });
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => {
            checkOrderStatus();
        }, 15000);
        let timeOutId;
        if (step === 3) {
            clearInterval(timerId);
            timeOutId = setTimeout(() => {
                navigate(`/${storeSlug}/post`);
            }, 10000);
        }
        return () => {
            clearInterval(timerId);
            if (step === 3) {
                clearTimeout(timeOutId);
                dispatch(guestSlice.actions.clearCart());
            }
        };
    }, [step]);

    return (
        <div className="w-full h-[100vh] flex justify-center bg-[#fbfbfb]">
            <div className="w-[1220px] h-100vh flex items-center">
                <div className="w-full border border-gray-400 h-[90%] rounded-xl shadow-lg flex overflow-hidden">
                    {/* Form */}
                    <div className="flex-1 border-r border-gray-400 p-5">
                        <form
                            className="h-full flex flex-col gap-4"
                            onSubmit={handleSubmit(handleOrder)}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={avatar || noAvatar}
                                    className="rounded-full w-[60px] aspect-square object-contain"
                                    alt="avatar"
                                ></img>
                                <span className="font-semibold text-xl">
                                    {name}
                                </span>
                            </div>
                            <CheckoutStepper activeStep={step} />
                            {step === 0 && (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex-1 flex flex-col gap-4">
                                        <InputForm
                                            label="Name"
                                            id="name"
                                            errors={errors}
                                            register={register}
                                            validate={{
                                                required: "Name is required",
                                                maxLength: {
                                                    value: 255,
                                                    message:
                                                        "Max length is 255 characters",
                                                },
                                            }}
                                            placeholder="Let we know your name"
                                        />
                                        <InputForm
                                            errors={errors}
                                            register={register}
                                            label="Phone"
                                            validate={{
                                                required:
                                                    "Missing Phone Number",
                                                pattern: {
                                                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                                    message:
                                                        "Invalid Phone Number",
                                                },
                                            }}
                                            id="phone"
                                            placeholder="Let we know your phone"
                                        />
                                        <TextAreaForm
                                            label="Note"
                                            id="note"
                                            errors={errors}
                                            register={register}
                                            validate={{
                                                maxLength: {
                                                    value: 500,
                                                    message:
                                                        "Your note is limited at 500 character",
                                                },
                                            }}
                                            placeholder="Type your note to us"
                                        />
                                    </div>
                                    {isSubmitting ? (
                                        <div className="flex justify-end gap-4">
                                            <AiOutlineLoading3Quarters
                                                className="animate-spin"
                                                size={20}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-4">
                                            <button
                                                className="px-4 py-2 min-w-[120px] rounded-md border-gray-400 border font-semibold text-lg"
                                                type="button"
                                                onClick={handleBack}
                                            >
                                                Back
                                            </button>
                                            <button
                                                className="px-4 py-2 min-w-[120px] rounded-md bg-main text-white font-semibold text-lg"
                                                type="submit"
                                            >
                                                Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {step === 1 && (
                                <div className="flex gap-3 h-[300px] items-center justify-center italic">
                                    <span>
                                        <AiOutlineLoading3Quarters
                                            size={24}
                                            className="animate-spin"
                                        />
                                    </span>
                                    <span>
                                        {`Waiting for accepting your order by ${name}.
                                        Don't leave this page!`}
                                    </span>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="flex gap-3 h-[300px] items-center justify-center italic">
                                    <span>
                                        <AiOutlineLoading3Quarters
                                            size={24}
                                            className="animate-spin"
                                        />
                                    </span>
                                    <span>
                                        {`Preparing your order! Wait a few minute`}
                                    </span>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="flex gap-3 h-[300px] items-center justify-center italic">
                                    <span className="font-semibold text-lg">{`Thanks a lot! Let enjoy your order. You will back to menu in 10s`}</span>
                                </div>
                            )}
                        </form>
                    </div>
                    {/* Product */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-5 h-full overflow-y-scroll flex flex-col gap-3">
                            {cart.map(
                                ({ product, price, qty, ...variants }) => (
                                    <div
                                        className="border rounded-lg border-gray-400 p-3 flex items-center gap-3"
                                        key={product.id + variants}
                                    >
                                        <img
                                            src={
                                                product?.images[0]?.path ||
                                                noImage
                                            }
                                            alt="item-thumb"
                                            className="w-[120px] aspect-square object-contain border border-gray-400 rounded-lg"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <div className="text-lg font-semibold">{`${product.name} (${qty})`}</div>
                                            <div className="flex flex-col italic gap-1">
                                                {Object.entries(variants).map(
                                                    (el) => (
                                                        <div
                                                            className="text-xs"
                                                            key={el[0] + el[1]}
                                                        >
                                                            {`- ${el[1]}`}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="text-md font-semibold">{`${formatMoney(
                                                +price * +qty
                                            )} VND`}</div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className=" border-t border-gray-400 p-5 flex flex-col gap-2">
                            <div className="flex justify-between text-lg font-semibold italic">
                                <span>Subtotal:</span>
                                <span>{`${formatMoney(subTotal)} VND`}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold italic">
                                <span>Discount:</span>
                                <span>{`${formatMoney(discount)} VND`}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold italic">
                                <span>Total:</span>
                                <span>{`${formatMoney(
                                    subTotal - discount
                                )} VND`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
