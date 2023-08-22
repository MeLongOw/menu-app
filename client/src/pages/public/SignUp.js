import { memo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import background from "src/assets/default-background.jpg";
import { MainButton } from "src/components/Buttons";
import { InputForm } from "src/components/Inputs";
import { apiRegister } from "src/libs/axios/apis";
import icons from "src/libs/react-icons/icons";
import Swal from "sweetalert2";

const { AiOutlineLoading3Quarters } = icons;

const SignUp = () => {
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        watch,
    } = useForm({ mode: "onSubmit" });
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        const { name, email, password, phone } = data;
        const finalPayload = { name, email, password, phone };
        const response = await apiRegister(finalPayload);
        if (response?.success) {
            Swal.fire(
                "Congratulation!",
                "Register Sucessfully!",
                "success"
            ).then(() => {
                navigate("/" + response.slug);
            });
        } else {
            if (response.message?.phone) {
                Swal.fire("Register Fail!", response.message.phone[0], "error");
            }
            if (response.message?.email) {
                Swal.fire("Register Fail!", response.message.email[0], "error");
            }
        }
    };

    // const handleCheckEmailExist = async (email) => {
    //     const response = await apiRegister({ email });

    // };

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
                    onSubmit={handleSubmit(handleRegister)}
                >
                    <InputForm
                        errors={errors}
                        register={register}
                        label="Store Name"
                        validate={{
                            required: "Store Name is required",
                        }}
                        id="name"
                        placeholder="Store Name"
                    />
                    <InputForm
                        errors={errors}
                        register={register}
                        label="Phone"
                        validate={{
                            required: "Missing Phone Number",
                            pattern: {
                                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                message: "Invalid Phone Number",
                            },
                        }}
                        id="phone"
                        placeholder="Phone"
                    />
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
                            // emailAvailable: handleCheckEmailExist,
                        }}
                        id="email"
                        placeholder="Email"
                    />
                    <InputForm
                        errors={errors}
                        register={register}
                        label="Password"
                        id="password"
                        validate={{
                            required: "Mising Password",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must have at least 8 characters",
                            },
                        }}
                        type="password"
                        placeholder="Password"
                    />
                    <InputForm
                        errors={errors}
                        register={register}
                        label="Confirm Password"
                        id="confirmPassword"
                        validate={{
                            required: "Mising Confirm Password",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must have at least 8 characters",
                            },
                            validate: (val) => {
                                if (watch("password") !== val) {
                                    return "Password does not match";
                                }
                            },
                        }}
                        type="password"
                        placeholder="Confirm Password"
                    />
                    <span className="block">
                        <span>Already have an account? </span>
                        <Link to="/login" className="text-red-600">
                            Login
                        </Link>
                    </span>

                    <div className="flex justify-end">
                        {isSubmitting ? (
                            <AiOutlineLoading3Quarters
                                size={30}
                                className="animate-spin"
                            />
                        ) : (
                            <MainButton name="Register" type="submit" />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(SignUp);
