import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiLogout } from "src/libs/axios/apis";
import icons from "src/libs/react-icons/icons";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import { userSlice } from "src/libs/redux/userSlice/userSlice";
import Swal from "sweetalert2";

const {
    AiOutlineShoppingCart,
    AiOutlineArrowUp,
    MdModeEdit,
    AiOutlineQrcode,
    RxExit,
    RiBillLine,
} = icons;

const AsideButtons = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, isEditMode, loggedInId, id } = useSelector(
        (state) => state.user
    );
    const { storeSlug } = useParams();

    const { cart } = useSelector((state) => state.guest);

    const handleEditModel = () => {
        dispatch(userSlice.actions.toggleEditMode());
    };

    const handleToggleCart = () => {
        dispatch(menuSlice.actions.toggleCart());
    };

    const handleMoveToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleLogout = async () => {
        const response = await apiLogout();
        if (response?.success) {
            localStorage.removeItem("ACCESS_TOKEN");
            Swal.fire("Success!", response.message, "success").then(() => {
                navigate("/login");
                dispatch(userSlice.actions.logOut());
            });
        }
    };

    const handleGoToAdmin = () => {
        if (isLoggedIn && loggedInId === id) navigate(`/${storeSlug}/order`);
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-3 text-white z-10">
            {isLoggedIn && loggedInId === id && (
                <div
                    className="rounded-full w-[72px] aspect-square bg-main flex items-center justify-center hover:cursor-pointer shadow-md"
                    onClick={handleLogout}
                >
                    <RxExit size={36} />
                </div>
            )}
            {isLoggedIn && loggedInId === id && (
                <div
                    className="rounded-full w-[72px] aspect-square bg-main flex items-center justify-center hover:cursor-pointer shadow-md"
                    onClick={handleGoToAdmin}
                >
                    <RiBillLine size={36} />
                </div>
            )}
            {isLoggedIn && loggedInId === id && (
                <div
                    className={`rounded-full w-[72px] aspect-square ${
                        isEditMode ? "bg-main" : "bg-gray-400"
                    }  flex items-center justify-center hover:cursor-pointer shadow-md`}
                    onClick={handleEditModel}
                >
                    <MdModeEdit size={36} />
                </div>
            )}
            <Link
                className="rounded-full w-[72px] aspect-square bg-main flex items-center justify-center hover:cursor-pointer shadow-md"
                to="qr"
            >
                <AiOutlineQrcode size={36} />
            </Link>
            <div
                className="relative rounded-full w-[72px] aspect-square bg-main flex items-center justify-center hover:cursor-pointer shadow-md"
                onClick={handleToggleCart}
            >
                <AiOutlineShoppingCart size={36} />
                <div className="absolute w-[28px] aspect-square bg-gray-900 rounded-full top-[0] left-[0] translate text-lg font-semibold text-center bg-opacity-80">
                    {cart.length}
                </div>
            </div>
            <div
                className="rounded-full w-[72px] aspect-square bg-main flex justify-center items-center hover:cursor-pointer shadow-md"
                onClick={handleMoveToTop}
            >
                <AiOutlineArrowUp size={36} />
            </div>
        </div>
    );
};

export default memo(AsideButtons);
