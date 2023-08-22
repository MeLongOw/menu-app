import React from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const QRcode = () => {
    const { storeSlug } = useParams();
    const { name } = useSelector((state) => state.user);
    return (
        <div className="w-full h-[100vh] flex items-center justify-center flex-col gap-10">
            <QRCode
                value={`${process.env.REACT_APP_BASE_URL}/${storeSlug}`}
                style={{ height: "500px", maxWidth: "500px", width: "500px" }}
            />
            <h3 className="text-4xl font-semibold">{`Scan to access to ${name}`}</h3>
        </div>
    );
};

export default QRcode;
