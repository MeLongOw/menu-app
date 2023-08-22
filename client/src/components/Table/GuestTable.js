import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { apiGetGuestData, apiUpdateGuestData } from "src/libs/axios/apis";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { Pagination } from "../Pagination/Pagination";
import icons from "src/libs/react-icons/icons";
const { AiOutlineLoading3Quarters } = icons;

const GuestTable = () => {
    const [guestData, setGuestData] = useState([]);
    const [showGuestData, setShowGuestData] = useState([]);
    const [searchGuestData, setSearchGuestData] = useState([]);
    const [searchPhoneValue, setSearchPhoneValue] = useState("");
    const [selectedPhoneOption, setSelectedPhoneOption] = useState("all");
    const [totalGuestItem, setTotalGuestItem] = useState();
    const [limitPerPageOfGuest, setLimitPerPageOfGuest] = useState(10);
    const [activeGuestPage, setActiveGuestPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const dispatch = useDispatch();
    const { storeSlug } = useParams();

    const fetchGuestData = async () => {
        setIsFetching(true);
        const response = await apiGetGuestData();
        if (response?.success) {
            setGuestData(response.data);
            setIsFetching(false);
        } else {
            setIsFetching(false);
        }
    };

    const handleToggleBlockGuest = async (phone) => {
        setGuestData((prev) =>
            prev.map((el) => {
                if (el.phone === phone) {
                    return { ...el, isBlocked: !el.isBlocked };
                }
                return el;
            })
        );

        const payload = guestData.map((el) => {
            if (el.phone === phone) {
                return { ...el, isBlocked: !el.isBlocked };
            }
            return el;
        });

        const response = await apiUpdateGuestData({
            guests: JSON.stringify(payload),
        });
    };

    useEffect(() => {
        dispatch(getCurrentUser(storeSlug));
        fetchGuestData();
    }, []);

    useEffect(() => {
        if (selectedPhoneOption === "all") {
            setShowGuestData(guestData);
        }
        if (selectedPhoneOption === "block") {
            setShowGuestData(guestData.filter((el) => el.isBlocked));
        }
        if (selectedPhoneOption === "notBlock") {
            setShowGuestData(guestData.filter((el) => !el.isBlocked));
        }
    }, [selectedPhoneOption, guestData]);

    useEffect(() => {
        if (searchPhoneValue) {
            setSearchGuestData(
                showGuestData.filter((el) =>
                    el.phone.includes(searchPhoneValue)
                )
            );
        } else {
            setSearchGuestData(showGuestData);
        }
    }, [showGuestData, searchPhoneValue]);

    useEffect(() => {
        setTotalGuestItem(searchGuestData.length);
    }, [searchGuestData]);

    useEffect(() => {
        setActiveGuestPage(1);
    }, [limitPerPageOfGuest, selectedPhoneOption, searchPhoneValue]);
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="border px-4 py-2 border-gray-400 rounded-md"
                    placeholder="Search by phone..."
                    value={searchPhoneValue}
                    onChange={(e) => setSearchPhoneValue(e.target.value)}
                />
                <div className="flex w-[200px] h-full">
                    <select
                        onChange={(e) => setSelectedPhoneOption(e.target.value)}
                        defaultValue={"all"}
                        className="bg-gray-50 border border-gray-400 text-gray-900 text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="all">All</option>
                        <option value="block">Blocked Phone</option>
                        <option value="notBlock">Not Blocked Phone</option>
                    </select>
                </div>

                <div className="flex w-[190px] h-full">
                    <select
                        onChange={(e) => setLimitPerPageOfGuest(e.target.value)}
                        defaultValue={limitPerPageOfGuest}
                        className="bg-gray-50 border border-gray-400 text-gray-900 text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / Page</option>
                        <option value={100}>100 / Page</option>
                    </select>
                </div>
                <div className="flex h-full items-center test-lg italic">
                    {`Show  items ${
                        totalGuestItem &&
                        limitPerPageOfGuest * (activeGuestPage - 1) + 1
                    } - ${
                        limitPerPageOfGuest * activeGuestPage > totalGuestItem
                            ? totalGuestItem
                            : limitPerPageOfGuest * activeGuestPage
                    }`}
                </div>
            </div>

            <div className="flex-1 flex flex-col relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className=" flex-1 overflow-y-scroll">
                    <table className="relative flex-1 w-full text-sm text-left text-gray-500 overflow-y-scroll">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 sticky top-0 border-b border-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 ">
                                    Phone
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 flex justify-end"
                                >
                                    Is blocked
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!searchGuestData.length ? (
                                searchGuestData
                                    .filter(
                                        (el, index) =>
                                            index >=
                                                limitPerPageOfGuest *
                                                    (activeGuestPage - 1) &&
                                            index <
                                                limitPerPageOfGuest *
                                                    activeGuestPage &&
                                            el
                                    )
                                    .map((el) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-900"
                                            key={el.phone}
                                        >
                                            <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap">
                                                {el.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="select-none flex justify-end">
                                                    <input
                                                        id={el.phone}
                                                        type="checkbox"
                                                        hidden
                                                        className="peer"
                                                        defaultChecked={
                                                            el.isBlocked
                                                        }
                                                        onChange={() =>
                                                            handleToggleBlockGuest(
                                                                el.phone
                                                            )
                                                        }
                                                    />

                                                    <label
                                                        className={`flex h-full rounded-lg items-center w-[100px] justify-center border-2 py-3 px-4 text-center border-gray-400
                                                                            peer-checked:border-red-600 peer-checked:text-main peer-checked:hover:bg-inherit`}
                                                        htmlFor={el.phone}
                                                    >
                                                        Block
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr className="">
                                    <td className="px-4 py-3">
                                        {isFetching ? (
                                            <div>
                                                <AiOutlineLoading3Quarters
                                                    className="animate-spin"
                                                    size={30}
                                                />
                                            </div>
                                        ) : (
                                            "No data"
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!!searchGuestData.length && (
                    <div className="flex justify-center p-3 bg-white">
                        <Pagination
                            totalItem={totalGuestItem}
                            active={activeGuestPage}
                            setActive={setActiveGuestPage}
                            limit={limitPerPageOfGuest}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestTable;
