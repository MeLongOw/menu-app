import Sidebar from "src/components/Menu/Sidebar";
import { memo } from "react";
import { useSelector } from "react-redux";
import { MenuList } from "src/components/Menu";
import icons from "src/libs/react-icons/icons";

const { AiOutlineLoading3Quarters } = icons;

const Menu = () => {
    const { isLoading } = useSelector((state) => state.menu);
    return (
        <div className="font-main flex w-full flex-col">
            <div className="flex w-full">
                {!isLoading ? (
                    <>
                        <Sidebar />
                        <div className="flex-1 pl-4 pb-4">
                            <MenuList />
                        </div>
                    </>
                ) : (
                    <div className="flex w-full items-center justify-center h-[300px]">
                        <AiOutlineLoading3Quarters
                            className="animate-spin"
                            size={60}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Menu);
