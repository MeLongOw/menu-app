import { Navbar } from "src/components/LayoutComponents";
import { memo, useEffect } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
    Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "src/libs/redux/menuSlice/asyncThunk";
import { AsideButtons } from "src/components/Buttons";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { Avatar } from "src/components/Avatar";
import { Background } from "src/components/Background";
import { Cart } from "src/components/Cart";
import { guestSlice } from "src/libs/redux/guestSlice/guestSlice";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { storeSlug } = useParams();
    const { id, name, isExistUser, isFindingUser } = useSelector(
        (state) => state.user
    );
    const { cartOfStoreId } = useSelector((state) => state.guest);

    //Get ProductCategory
    useEffect(() => {
        if (!id) dispatch(getCurrentUser(storeSlug));
        if (id) {
            if (cartOfStoreId !== id) {
                console.log(1);
                dispatch(guestSlice.actions.clearCart());
                dispatch(guestSlice.actions.setStoreId(id));
            }

            dispatch(getCategories(id));
            if (
                pathname.split("/")[1] === storeSlug &&
                pathname.split("/").length < 3
            ) {
                navigate("post");
            }
        }
    }, [id]);

    return (
        <>
            {isExistUser ? (
                !isFindingUser && (
                    <div className="flex justify-center">
                        <div className="w-main">
                            <Background />
                            <div className="relative">
                                <Avatar />
                                <div className="pt-[120px] mb-4">
                                    <div className="flex justify-center mt-4 text-3xl font-bold ">
                                        {name}
                                    </div>
                                </div>
                                <Navbar />
                                <div className="mt-4">
                                    <Outlet />
                                </div>
                            </div>
                            <AsideButtons />
                            <Cart />
                        </div>
                    </div>
                )
            ) : (
                <Navigate to={"notfound"} />
            )}
        </>
    );
};

export default memo(Home);
