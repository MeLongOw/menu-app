import React, { memo } from "react";
import PropTypes from "prop-types";

const Modal = ({ children, isOpen, onCancel = () => {} }) => {
  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
        onClick={() => onCancel()}
      >
        {children}
      </div>
    )
  );
};

Modal.propTypes = {
  children: PropTypes.element,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default memo(Modal);
