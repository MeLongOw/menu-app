import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import noAvatar from "src/assets/no-avatar.png";
import { GuestTable, OrderTable } from "src/components/Table";

const Order = () => {
    const { loggedInId, isLoggedIn, id, name, avatar } = useSelector(
        (state) => state.user
    );

    const navigate = useNavigate();
    const { storeSlug } = useParams();
    const [sidebar, setSidebar] = useState([
        { name: "Orders", isChecked: true, id: 1 },
        { name: "Guests", isChecked: false, id: 2 },
    ]);
    const handleNavigate = (id) => {
        setSidebar((prev) =>
            prev.map((el) => {
                if (el.id === id) {
                    return { ...el, isChecked: true };
                }
                return { ...el, isChecked: false };
            })
        );
    };
    return isLoggedIn && loggedInId === id ? (
        <div className="flex">
            <div className="h-[100vh] border-r border-gray-400 w-[360px] flex flex-col">
                <div className="flex items-center gap-4 border-b border-gray-400 p-5">
                    <img
                        src={avatar|| noAvatar}
                        alt="avatar"
                        className="w-[60px] aspect-square rounded-full hover:cursor-pointer border border-gray-400"
                        onClick={() => navigate(`/${storeSlug}/post`)}
                    />
                    <div
                        className="text-lg font-semibold hover:cursor-pointer"
                        onClick={() => navigate(`/${storeSlug}/post`)}
                    >
                        {name}
                    </div>
                </div>
                <div className="p-4">
                    {sidebar.map((el) => (
                        <div
                            className={`flex justify-center py-3 rounded-lg select-none hover:bg-gray-300 text-lg font-semibold ${
                                el.isChecked
                                    ? "text-main"
                                    : " hover:cursor-pointer "
                            }`}
                            key={el.id}
                            onClick={() => {
                                if (!el.isChecked) handleNavigate(el.id);
                            }}
                        >
                            {el.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 h-[100vh] p-5 flex flex-col">
                {sidebar.map((el) => {
                    if (el.isChecked && el.name === "Orders") {
                        return <OrderTable key={el.id} />;
                    }
                    if (el.isChecked && el.name === "Guests") {
                        return <GuestTable key={el.id} />;
                    }
                    return <div key="void"></div>;
                })}
            </div>
        </div>
    ) : (
        <Navigate to={`/${storeSlug}/post`}></Navigate>
    );
};

export default Order;
