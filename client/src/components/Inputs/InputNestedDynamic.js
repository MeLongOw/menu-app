import React, { memo } from "react";
import { useFieldArray } from "react-hook-form";
import icons from "src/libs/react-icons/icons";
import { toCapitalize } from "src/utils/toCapitalize";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const { IoAddCircleOutline, IoIosRemoveCircleOutline } = icons;

const InputNestedDynamic = ({
    nestIndex,
    control,
    register,
    parent,
    child,
    childrenFields = [],
    errors = {},
    validates = [],
}) => {
    const { edittingProduct } = useSelector((state) => state.menu);

    const childrenFieldsObj = childrenFields.reduce((result, key) => {
        result[key] = "";
        return result;
    }, {});
    const { fields, remove, append } = useFieldArray({
        control,
        name: `${parent}.${nestIndex}.${child}`,
    });
    return (
        <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-center">
                    {childrenFields.map((childrenField, _index) => (
                        <div
                            key={`${field.id}.${childrenField}`}
                            className="flex gap-2 items-center"
                        >
                            <label className="capitalize">
                                {childrenField}:
                            </label>
                            <input
                                className="border flex justify-center items-center gap-2 rounded-md p-3 hover:cursor-pointer w-[196px]"
                                {...register(
                                    `${parent}.${nestIndex}.${child}.${index}.${childrenField}`,
                                    validates[_index]
                                )}
                                placeholder={toCapitalize(childrenField)}
                            />
                            {errors?.[parent]?.[nestIndex]?.[child]?.[index]?.[
                                childrenField
                            ]?.message && (
                                <small className="text-xs text-red-500 italic">
                                    {
                                        errors?.[parent]?.[nestIndex]?.[
                                            child
                                        ]?.[index]?.[childrenField]?.message
                                    }
                                </small>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-2">
                        {edittingProduct && (
                            <div>
                                <input
                                    id={`active-${nestIndex}-${index}`}
                                    type="checkbox"
                                    hidden
                                    className="peer"
                                    {...register(
                                        `${parent}.${nestIndex}.${child}.${index}.active`
                                    )}
                                />
                                <label
                                    className="flex select-none h-full rounded-lg items-center justify-center border-2 border-gray-400 text-center py-3 px-4 hover:cursor-pointer peer-checked:border-red-600"
                                    htmlFor={`active-${nestIndex}-${index}`}
                                >
                                    Active
                                </label>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            className={`${fields.length <= 1 && "opacity-50"}`}
                        >
                            <IoIosRemoveCircleOutline size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => append(childrenFieldsObj)}
                        >
                            <IoAddCircleOutline size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

InputNestedDynamic.propTypes = {
    nestIndex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.oneOf([undefined]),
    ]),
    control: PropTypes.object,
    register: PropTypes.func,
    parent: PropTypes.string,
    child: PropTypes.string,
    childrenFields: PropTypes.array,
    errors: PropTypes.object,
    validates: PropTypes.array,
};

export default memo(InputNestedDynamic);
