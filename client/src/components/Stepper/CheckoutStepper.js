import React from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";

export function CheckoutStepper({ activeStep = 0 }) {
    return (
        <div className="w-full py-4">
            <Stepper activeStep={activeStep} activeLineClassName="bg-main">
                <Step completedClassName="bg-main" activeClassName="bg-main">
                    1
                </Step>
                <Step completedClassName="bg-main" activeClassName="bg-main">
                    2
                </Step>
                <Step completedClassName="bg-main" activeClassName="bg-main">
                    3
                </Step>
                <Step completedClassName="bg-main" activeClassName="bg-main">
                    4
                </Step>
            </Stepper>
        </div>
    );
}
