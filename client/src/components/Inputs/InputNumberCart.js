import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { guestSlice } from "src/libs/redux/guestSlice/guestSlice";

const InputNumberCart = ({ itemIndex, qty }) => {
    const dispatch = useDispatch();
    const handleDecrease = () => {
        if (qty > 1) {
            dispatch(guestSlice.actions.decreaseQty(itemIndex));
        }
    };

    const handleIncrease = () => {
        // setValue((prev) => prev + 1);
        dispatch(guestSlice.actions.increaseQty(itemIndex));
    };
    return (
        <div className="flex items-center">
            <div
                className="border border-black px-2 text-lg hover:cursor-pointer"
                onClick={handleDecrease}
            >
                -
            </div>
            <input
                type="number"
                value={qty}
                className="border border-black border-x-0 min-w-[40px] w-[40px] text-center text-lg outline-none"
                onChange={(e) => {
                    dispatch(
                        guestSlice.actions.setQty({
                            index: itemIndex,
                            value: Math.floor(e.target.value),
                        })
                    );
                }}
                onBlur={(e) => {
                    if (!+e.target.value) {
                        dispatch(
                            guestSlice.actions.setQty({
                                index: itemIndex,
                                value: 1,
                            })
                        );
                    } else {
                        dispatch(
                            guestSlice.actions.setQty({
                                index: itemIndex,
                                value: Math.floor(e.target.value),
                            })
                        );
                    }
                }}
            />
            <div
                className="border border-black px-2 text-lg hover:cursor-pointer"
                onClick={handleIncrease}
            >
                +
            </div>
        </div>
    );
};

// InputNumber.propTypes = {
//     register: PropTypes.func,
//     id: PropTypes.string,
//     label: PropTypes.string,
// };

export default memo(InputNumberCart);
