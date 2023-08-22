import { memo } from "react";
import PropTypes from "prop-types";

const InputForm = ({
    label,
    disabled,
    register = () => {},
    errors = {},
    id,
    validate,
    type = "text",
    placeholder,
}) => {
    return (
        <>
            <div className="flex flex-col gap-2">
                {label && <label htmlFor={id}>{label}</label>}
                <input
                    type={type}
                    {...register(id, validate)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full border flex justify-center items-center gap-2 rounded-md p-3 hover:cursor-pointer"
                />
                {errors[id] && (
                    <small className="text-xs text-red-500 italic">
                        {errors[id]?.message}
                    </small>
                )}
            </div>
        </>
    );
};

InputForm.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    id: PropTypes.string.isRequired,
    validate: PropTypes.object,
    type: PropTypes.oneOf([
        "text",
        "password",
        "email",
        "file",
        "checkbox",
        "number",
    ]),
    placeholder: PropTypes.string,
};

export default memo(InputForm);
