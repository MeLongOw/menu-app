import { memo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import background from "src/assets/default-background.jpg";
import { MainButton } from "src/components/Buttons";
import { InputForm } from "src/components/Inputs";
import { apiLogin } from "src/libs/axios/apis";

const ForgotPassword = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const handleLogin = async (data) => {
        console.log(data);
        const response = await apiLogin(data);
        if (response?.success) {
            localStorage.setItem("ACCESS_TOKEN", response.token);
        }
    };

    return (
        <div className="w-full h-[100vh]">
            <img
                src={background}
                alt="background"
                className="w-full h-[100vh] object-fill"
            />

            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
                <form
                    className="w-[600px] bg-white rounded-xl p-4 flex flex-col gap-4"
                    onSubmit={handleSubmit(handleLogin)}
                >
                    <h3 className="flex justify-center font-semibold text-lg">
                        Please type your email to recover your password
                    </h3>
                    <InputForm
                        errors={errors}
                        register={register}
                        label="Email"
                        validate={{
                            required: "Missing Email",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        }}
                        id="email"
                        placeholder="Email"
                    />
                    <div>
                        <span className="flex gap-2">
                            <span>Back to Login?</span>
                            <Link to="/signup" className="text-red-600">
                                Login
                            </Link>
                        </span>
                    </div>

                    <div className="flex justify-end">
                        <MainButton name="Submit" type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(ForgotPassword);
