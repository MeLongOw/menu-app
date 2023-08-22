import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Order } from "./pages/private";
import {
    About,
    ForgotPassword,
    Home,
    Login,
    Menu,
    Post,
    SignUp,
    GetStart,
    QRcode,
    NotFound,
    Checkout,
} from "./pages/public";
function App() {
    const { cart } = useSelector((state) => state.guest);
    return (
        <div className="w-full min-h-[100vh] bg-[#f0f2f5]">
            <Routes>
                <Route path="/" element={<GetStart />} />
                {<Route path="/login" element={<Login />} />}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                <Route path="/:storeSlug" element={<Home />}>
                    <Route path="/:storeSlug/menu" element={<Menu />} />
                    <Route path="/:storeSlug/post" element={<Post />} />
                    <Route path="/:storeSlug/about" element={<About />} />
                </Route>
                <Route path="/:storeSlug/order" element={<Order />} />
                {!!cart.length && (
                    <Route path="/:storeSlug/checkout" element={<Checkout />} />
                )}
                <Route path="/:storeSlug/notfound" element={<NotFound />} />
                <Route path="/:storeSlug/qr" element={<QRcode />} />
            </Routes>
        </div>
    );
}

export default App;
