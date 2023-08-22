import { memo } from "react";
import PropTypes from "prop-types";

const TextAreaForm = ({
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    placeholder,
}) => {
    return (
        <>
            <div className="flex flex-col gap-2">
                {label && <label htmlFor={id}>{label}</label>}
                <textarea
                    {...register(id, validate)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full border rounded-md p-3 min-h-[100px] max-h-[260px]"
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

TextAreaForm.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    id: PropTypes.string.isRequired,
    validate: PropTypes.object,
    placeholder: PropTypes.string,
};

export default memo(TextAreaForm);
