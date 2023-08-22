import { memo } from "react";
import { Link } from "react-router-dom";
import background from "src/assets/default-background.jpg";
import getStartImage from "src/assets/getstart.png";

const GetStart = () => {
    return (
        <div className="w-full h-[100vh]">
            <img
                src={background}
                alt="background"
                className="w-full h-[100vh] object-fill"
            />
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
                <div className="w-[65%] h-[60%] bg-[#fbfbfb] rounded-2xl shadow-teal-500 shadow-xl flex flex-col p-10 items-center justify-center">
                    <div className="flex justify-center">
                        <h3 className="text-6xl text-red-500 font-semibold italic">
                            Meow Corp
                        </h3>
                    </div>
                    <div className="w-full flex mt-12">
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <span className="text-5xl font-semibold">
                                    Create your
                                </span>
                                <span className="text-brown-500 text-5xl font-semibold">
                                    own digital store
                                </span>
                            </div>
                            <div className="mt-3 text-xl font-medium text-orange-400">
                                Easier for you!
                            </div>
                            <div className="mt-3 text-xl italic">
                                Let your client understand about your store and
                                take order via digital device.
                            </div>
                            <div className="mt-4">
                                <Link
                                    className="flex justify-center text-white font-medium text-xl max-w-[120px] bg-main rounded-md px-4 py-2"
                                    to={"/login"}
                                >
                                    Get Start
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1">
                            <img
                                alt="getstart"
                                src={getStartImage}
                                className="w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(GetStart);
