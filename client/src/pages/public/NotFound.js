import background from "src/assets/default-background.jpg";
import pageNotFound from "src/assets/page-not-found.jpg";

const NotFound = () => {
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
                    <div className="w-full flex flex-col items-center justify-center">
                        <img
                            alt="getstart"
                            src={pageNotFound}
                            className="w-[360px] aspect-square object-contain"
                        />
                        <h4 className="font-semibold text-3xl italic">Page not found</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
