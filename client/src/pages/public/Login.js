import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import background from "src/assets/default-background.jpg";
import { MainButton } from "src/components/Buttons";
import { InputForm } from "src/components/Inputs";
import { apiLogin } from "src/libs/axios/apis";
import { userSlice } from "src/libs/redux/userSlice/userSlice";
import Swal from "sweetalert2";
import icons from "src/libs/react-icons/icons";

const { AiOutlineLoading3Quarters } = icons;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

    const handleLogin = async (data) => {
        const response = await apiLogin(data);
        if (response?.success) {
            localStorage.setItem("ACCESS_TOKEN", response.token);
            dispatch(userSlice.actions.loggedIn(response.id));
            Swal.fire("Login Successfullly!", response.message, "success").then(
                () => {
                    navigate(`/${response.slug}`);
                }
            );
        } else {
            Swal.fire("Login Failed!", response.message, "error");
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
                    <div>
                        <span className="flex gap-2">
                            <span>Don't have an account?</span>
                            <Link to="/signup" className="text-red-600">
                                Sign up
                            </Link>
                        </span>
                        <span className="flex gap-2">
                            <span>Forgot Password?</span>
                            <Link to="/forgotpassword" className="text-red-600">
                                Change password via email
                            </Link>
                        </span>
                    </div>

                    {
                        <div className="flex justify-end">
                            {isSubmitting ? (
                                <AiOutlineLoading3Quarters
                                    size={30}
                                    className="animate-spin"
                                />
                            ) : (
                                <MainButton name="Login" type="submit" />
                            )}
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};

export default memo(Login);
