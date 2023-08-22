import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
    apiGetOrderData,
    apiUpdateOrderStatus,
    apiUpdateReadStatusOrder,
} from "src/libs/axios/apis";
import { getCurrentUser } from "src/libs/redux/userSlice/asyncThunk";
import { Pagination } from "../Pagination/Pagination";
import icons from "src/libs/react-icons/icons";
import moment from "moment";
import Datepicker from "react-tailwindcss-datepicker";
import { Modal } from "../Modal";
import { formatMoney } from "src/utils/formatMoney";

const { AiOutlineLoading3Quarters, CiCircleRemove, IoCloseSharp } = icons;

const OrderTable = () => {
    const [orderData, setOrderData] = useState([]);
    // const [showOrderData, setShowOrderData] = useState([]);
    const [searchGuestData, setSearchGuestData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedOption, setSelectedOption] = useState("processing");
    const [totalOrderItem, setTotalOrderItem] = useState();
    const [limitPerPageOfOrder, setLimitPerPageOfOrder] = useState(10);
    const [activeOrderPage, setActiveOrderPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
    const [detailOrder, setDetailOrder] = useState(null);
    const dispatch = useDispatch();
    const { storeSlug } = useParams();

    const [datepicker, setDatepicker] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });

    const fetchOrderData = async () => {
        const response = await apiGetOrderData({
            date: moment(datepicker.startDate).format("YYYY-MM-DD"),
            status: selectedOption,
        });
        if (response?.success) {
            setOrderData(response.data);
        } else {
            setIsFetching(false);
        }
    };

    const handleChangeIsRead = async (id) => {
        setOrderData((prev) =>
            prev.map((el) => {
                if (el.id === id) {
                    return { ...el, isRead: !el.isRead };
                }
                return el;
            })
        );

        const response = await apiUpdateReadStatusOrder(id);
    };

    const handleChangeOrderStatus = async (id, status) => {
        console.log(status);
        const response = await apiUpdateOrderStatus(id, { status });
        if (response?.success) {
            console.log(response);
            fetchOrderData();
            setUpdatingId(null);
        } else {
            setUpdatingId(null);
        }
    };

    const handleShowDetailOrder = (products, note) => {
        setIsOpenModalDetail(true);
        setDetailOrder({ products: JSON.parse(products), note });
    };

    const handleCloseDetail = () => {
        setIsOpenModalDetail(false);
        setDetailOrder(null);
    };

    useEffect(() => {
        dispatch(getCurrentUser(storeSlug));
    }, []);

    useEffect(() => {
        if (searchValue) {
            setSearchGuestData(
                orderData.filter(
                    (el) =>
                        el.phone.includes(searchValue) ||
                        el.name
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                        el.id.toString().includes(searchValue)
                )
            );
        } else {
            setSearchGuestData(orderData);
        }
        setIsFetching(false);
    }, [orderData, searchValue]);

    useEffect(() => {
        fetchOrderData();
        setIsFetching(true);
    }, [datepicker, selectedOption]);

    useEffect(() => {
        const timerId = setInterval(() => {
            fetchOrderData();
        }, 15000);
        return () => {
            clearInterval(timerId);
        };
    }, [datepicker, selectedOption]);

    useEffect(() => {
        setTotalOrderItem(searchGuestData.length);
    }, [searchGuestData]);

    useEffect(() => {
        setActiveOrderPage(1);
    }, [limitPerPageOfOrder, selectedOption, searchValue]);

    const handleDateChange = (newValue) => {
        setDatepicker(newValue);
    };
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex gap-2">
                <div>
                    <Datepicker
                        value={datepicker}
                        onChange={handleDateChange}
                        className="border border-gray-400"
                        asSingle
                        useRange={false}
                        readOnly
                        inputClassName="border border-gray-400 rounded-md px-4 py-2 text-lg"
                    />
                </div>
                <input
                    type="text"
                    className="border px-4 py-2 border-gray-400 rounded-md w-[300px]"
                    placeholder="Search by phone or id or name..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="flex w-[200px] h-full">
                    <select
                        onChange={(e) => setSelectedOption(e.target.value)}
                        defaultValue={"processing"}
                        className="bg-gray-50 border border-gray-400 text-gray-900 text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="processing">Processing</option>
                        <option value="accepted">Accepted</option>
                        <option value="success">Success</option>
                        <option value="cancelled">Cancel</option>
                    </select>
                </div>

                <div className="flex w-[190px] h-full">
                    <select
                        onChange={(e) => setLimitPerPageOfOrder(e.target.value)}
                        defaultValue={limitPerPageOfOrder}
                        className="bg-gray-50 border border-gray-400 text-gray-900 text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / Page</option>
                        <option value={100}>100 / Page</option>
                    </select>
                </div>
                <div className="flex h-full items-center test-lg italic">
                    {`Show  items ${
                        totalOrderItem &&
                        limitPerPageOfOrder * (activeOrderPage - 1) + 1
                    } - ${
                        limitPerPageOfOrder * activeOrderPage > totalOrderItem
                            ? totalOrderItem
                            : limitPerPageOfOrder * activeOrderPage
                    }`}
                </div>
            </div>

            <div className="flex-1 flex flex-col relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className=" flex-1 overflow-y-scroll">
                    <table className="relative flex-1 w-full text-sm text-left text-gray-500 overflow-y-scroll">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 sticky top-0 border-b border-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 ">
                                    id
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                    Created at
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 flex justify-end"
                                >
                                    Detail
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isFetching ? (
                                !searchGuestData.length ? (
                                    <tr>
                                        <td>
                                            <div className="px-4 py-3">
                                                No data
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    searchGuestData
                                        .filter(
                                            (el, index) =>
                                                index >=
                                                    limitPerPageOfOrder *
                                                        (activeOrderPage - 1) &&
                                                index <
                                                    limitPerPageOfOrder *
                                                        activeOrderPage &&
                                                el
                                        )
                                        .map((el) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-900"
                                                key={el.id}
                                            >
                                                <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap">
                                                    {el.id}
                                                </td>
                                                <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap">
                                                    {moment(
                                                        el.createdAt
                                                    ).format("hh:mm DD/MM/YY")}
                                                </td>
                                                <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap">
                                                    {el.phone}
                                                </td>
                                                <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap capitalize">
                                                    {el.name}
                                                </td>
                                                <td className="px-6 py-4 font-lg text-lg text-gray-900 whitespace-nowrap capitalize">
                                                    {updatingId === el.id ? (
                                                        <div className="flex w-full justify-center">
                                                            <AiOutlineLoading3Quarters
                                                                className="animate-spin"
                                                                size={24}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`border text-center rounded-lg text-md ${
                                                                el.status ===
                                                                    "processing" &&
                                                                "text-blue-600 border-blue-600"
                                                            } ${
                                                                el.status ===
                                                                    "accepted" &&
                                                                "text-yellow-600 border-yellow-600"
                                                            } ${
                                                                el.status ===
                                                                    "success" &&
                                                                "text-green-600 border-green-600"
                                                            } ${
                                                                el.status ===
                                                                    "cancelled" &&
                                                                "text-red-600 border-red-600"
                                                            }`}
                                                        >
                                                            <select
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setUpdatingId(
                                                                        el.id
                                                                    );
                                                                    handleChangeOrderStatus(
                                                                        el.id,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                defaultValue={
                                                                    el.status
                                                                }
                                                                className="outline-none text-gray-900 text-inherit text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            >
                                                                {
                                                                    <option
                                                                        value="processing"
                                                                        className="text-blue-600 disabled:hidden"
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        Processing
                                                                    </option>
                                                                }
                                                                <option
                                                                    value="accepted"
                                                                    className="text-yellow-600 disabled:hidden"
                                                                    disabled={
                                                                        el.status !==
                                                                        "processing"
                                                                    }
                                                                >
                                                                    Accepted
                                                                </option>
                                                                <option
                                                                    value="success"
                                                                    className="text-green-600 disabled:hidden"
                                                                    disabled={
                                                                        el.status ===
                                                                        "processing"
                                                                    }
                                                                >
                                                                    Success
                                                                </option>
                                                                <option
                                                                    value="cancelled"
                                                                    className="text-red-600"
                                                                >
                                                                    Cancelled
                                                                </option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="select-none flex justify-end">
                                                        <input
                                                            id={el.id}
                                                            type="radio"
                                                            hidden
                                                            className="peer"
                                                            defaultChecked={
                                                                el.isRead
                                                            }
                                                            onChange={() =>
                                                                handleChangeIsRead(
                                                                    el.id
                                                                )
                                                            }
                                                        />

                                                        <label
                                                            className={`flex h-full rounded-lg items-center w-[100px] justify-center border-2 py-4 px-2 text-center border-gray-400
                                                        hover:cursor-pointer hover:bg-gray-200
                                                         peer-checked:border-red-600 peer-checked:text-main`}
                                                            htmlFor={el.id}
                                                            onClick={() =>
                                                                handleShowDetailOrder(
                                                                    el.products,
                                                                    el.note
                                                                )
                                                            }
                                                        >
                                                            Detail
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                )
                            ) : (
                                <tr className="">
                                    <td className="px-4 py-3">
                                        {
                                            <div>
                                                <AiOutlineLoading3Quarters
                                                    className="animate-spin"
                                                    size={30}
                                                />
                                            </div>
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!!searchGuestData.length && (
                    <div className="flex justify-center p-3 bg-white">
                        <Pagination
                            totalItem={totalOrderItem}
                            active={activeOrderPage}
                            setActive={setActiveOrderPage}
                            limit={limitPerPageOfOrder}
                        />
                    </div>
                )}
            </div>
            <Modal isOpen={isOpenModalDetail} onCancel={handleCloseDetail}>
                <div
                    className="w-[600px] h-[90%] bg-white rounded-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="h-[60px] border-b border-gray-400 p-5 flex justify-end">
                        <CiCircleRemove
                            size={30}
                            onClick={handleCloseDetail}
                            className="hover:cursor-pointer"
                        />
                    </div>
                    <div className="flex-1 p-5 overflow-y-scroll flex flex-col gap-4">
                        {detailOrder?.note && (
                            <div className="flex flex-col gap-2">
                                <div className="text-main">Note</div>
                                <div className="p-3 border rounded-lg text-main border-main flex justify-between">
                                    {detailOrder?.note}
                                </div>
                            </div>
                        )}
                        {detailOrder?.products.map((product) => (
                            <div
                                key={product.id}
                                className="p-3 border rounded-lg border-gray-400 flex justify-between"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="text-lg font-semibold">
                                        {product.name}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {product.variants.map((el) => (
                                            <div className="flex gap-2 italic text-sm">
                                                <span className="font-semibold">
                                                    {`+ ${el.name}:`}
                                                </span>
                                                <span>
                                                    {el.subVariant.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <span className="text-base font-semibold">
                                            Price:
                                        </span>
                                        <span className="text-base font-medium">
                                            {`${formatMoney(
                                                Math.max(
                                                    ...product.variants.map(
                                                        (variant) =>
                                                            variant.subVariant
                                                                .price
                                                    )
                                                )
                                            )} VND`}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-lg font-semibold">
                                            Total:
                                        </span>
                                        <span className="text-lg font-medium">
                                            {`${formatMoney(
                                                Math.max(
                                                    ...product.variants.map(
                                                        (variant) =>
                                                            variant.subVariant
                                                                .price
                                                    )
                                                ) * product.qty
                                            )} VND`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <IoCloseSharp />
                                    <span className="font-semibold text-lg">
                                        {product.qty}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-[60px] border-t border-gray-400 p-5">
                        <div className="flex justify-between text-lg font-semibold items-center">
                            <span>Total:</span>
                            <span>
                                {formatMoney(
                                    detailOrder?.products.reduce(
                                        (total, product) =>
                                            (total +=
                                                product.qty *
                                                Math.max(
                                                    ...product.variants.map(
                                                        (variant) =>
                                                            variant.subVariant
                                                                .price
                                                    )
                                                )),
                                        0
                                    )
                                )}{" "}
                                VND
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderTable;
