import { memo } from "react";
import { NavLink } from "react-router-dom";

const navbarItem = [
    { id: 1, name: "Post", path: "post" },
    { id: 2, name: "Menu", path: "menu" },
    { id: 3, name: "About Us", path: "about" },
];
const Navbar = () => {
    return (
        <div className="flex justify-between border items-center shadow-md">
            {navbarItem.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.id}
                    className={({ isActive }) =>
                        `border-r text-lg font-semibold p-3 flex-1 text-center hover:text-main hover:cursor-pointer last:border-0 ${
                            isActive ? "text-main" : "hover:bg-gray-200"
                        }`
                    }
                >
                    {item.name}
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Navbar);
