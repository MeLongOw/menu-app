import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function Pagination({
    limit,
    totalItem = 1,
    active = 1,
    setActive = () => {},
}) {
    const [totalPage, setTotalPage] = useState(1);
    const getItemProps = (index) => ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
        className: "rounded-full text-gray-800 text-lg",
    });

    const next = () => {
        if (active === 5) return;

        setActive(active + 1);
    };

    const prev = () => {
        if (active === 1) return;

        setActive(active - 1);
    };

    useEffect(() => {
        setTotalPage(Math.ceil(totalItem / limit));
    }, [limit, totalItem]);

    return (
        <div className="flex items-center gap-4 bg-white">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full text-gray-700"
                onClick={prev}
                disabled={active === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                    (el) => {
                        let shouldShow = [
                            active - 2,
                            active - 1,
                            active,
                            active + 1,
                            active + 2,
                        ];

                        if (active === 1) {
                            shouldShow = [
                                active,
                                active + 1,
                                active + 2,
                                active + 3,
                                active + 4,
                            ];
                        }
                        if (active === 2) {
                            shouldShow = [
                                active - 1,
                                active,
                                active + 1,
                                active + 2,
                                active + 3,
                            ];
                        }
                        if (active === totalPage) {
                            shouldShow = [
                                active - 4,
                                active - 3,
                                active - 2,
                                active - 1,
                                active,
                            ];
                        }
                        if (active === totalPage - 1) {
                            shouldShow = [
                                active - 3,
                                active - 2,
                                active - 1,
                                active,
                                active + 1,
                            ];
                        }

                        return (
                            shouldShow.includes(el) && (
                                <IconButton {...getItemProps(el)} key={el}>
                                    {el}
                                </IconButton>
                            )
                        );
                    }
                )}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full text-gray-700"
                onClick={next}
                disabled={active === totalPage}
            >
                Next
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}
