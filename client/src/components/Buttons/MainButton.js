import { memo } from "react";
import PropTypes from "prop-types";

const MainButton = ({
    name,
    onClick,
    type='button',
    background = "bg-main",
    border,
    textColor = "text-white",
}) => {
    return (
        <button
            className={`${background} px-4 py-2 ${textColor} rounded-lg capitalize font-semibold ${
                border && "border"
            }`}
            onClick={onClick}
            type={type}
        >
            {name}
        </button>
    );
};

MainButton.propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    background: PropTypes.string,
    border: PropTypes.bool,
    textColor: PropTypes.string,
};

export default memo(MainButton);
