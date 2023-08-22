import React, { memo } from "react";
import PropTypes from "prop-types";

const InputNumber = ({
    id,
    label,
    register = () => {},
    setValue = () => {},
    watch = () => {},
}) => {
    // const [value, setValue] = useState(1);
    const handleDecrease = () => {
        if (watch(id) > 1) {
            setValue(id, +watch(id) - 1);
        }
    };

    const handleIncrease = () => {
        setValue(id, +watch(id) + 1);
    };
    return (
        <div className="flex items-center gap-4">
            {label && (
                <label
                    className="text-lg font-semibold capitalize"
                    htmlFor={id}
                >
                    {label}:
                </label>
            )}
            <div className="flex items-center">
                <div
                    className="border border-black px-2 py-2 text-lg hover:cursor-pointer"
                    onClick={handleDecrease}
                >
                    -
                </div>
                <input
                    id={id}
                    type="number"
                    defaultValue={1}
                    className="border border-black border-x-0 min-w-[40px] w-[40px] text-center text-lg py-2 outline-none"
                    onChange={(e) => {
                        setValue(Math.floor(e.target.value));
                    }}
                    onBlur={(e) => {
                        if (!+e.target.value) {
                            setValue(1);
                        } else {
                            setValue(+e.target.value);
                        }
                    }}
                    {...register(id)}
                />
                <div
                    className="border border-black px-2 py-2 text-lg hover:cursor-pointer"
                    onClick={handleIncrease}
                >
                    +
                </div>
            </div>
        </div>
    );
};

InputNumber.propTypes = {
    register: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
};

export default memo(InputNumber);
