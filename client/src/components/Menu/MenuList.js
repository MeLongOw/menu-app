import { apiGetProducts } from "src/libs/axios/apis";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuItem from "./MenuItem";
import { useDispatch, useSelector } from "react-redux";
import MainButton from "src/components/Buttons/MainButton";
import { menuSlice } from "src/libs/redux/menuSlice/menuSlice";
import MenuDetailItem from "./MenuDetailItem";
import MenuForm from "./MenuForm";
import { getProducts } from "src/libs/redux/menuSlice/asyncThunk";

const MenuList = () => {
    const [productDetail, setProductDetail] = useState(null);
    const { categories, products } = useSelector((state) => state.menu);
    const { isEditMode, id } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const handleOpenForm = () => {
        dispatch(menuSlice.actions.openMenuForm());
    };

    const handleDetailItem = (product) => {
        setProductDetail(product);
        dispatch(menuSlice.actions.openMenuDetailItem());
    };

    //fetch product
    useEffect(() => {
        if (id) dispatch(getProducts());
    }, [id]);

    return (
        <div>
            {isEditMode && (
                <div className="mb-4">
                    <MainButton name="Add new" onClick={handleOpenForm} />
                </div>
            )}
            {!!categories.length &&
                categories.map((category, index) => (
                    <section
                        key={category.id}
                        id={category.name + category.name}
                    >
                        <h3
                            className={`py-4 font-bold text-lg uppercase ${
                                index && "mt-4 border-main border-t"
                            }`}
                        >
                            {category.name}
                        </h3>
                        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
                            {products
                                .filter((product) =>
                                    product.categories.some(
                                        (el) => el.id === category.id
                                    )
                                )
                                .map((product) => (
                                    <MenuItem
                                        key={product?.id}
                                        product={product}
                                        onClick={handleDetailItem}
                                    />
                                ))}
                        </div>
                    </section>
                ))}
            {productDetail && (
                <MenuDetailItem
                    product={productDetail}
                    setProduct={setProductDetail}
                />
            )}
            <MenuForm />
        </div>
    );
};

export default memo(MenuList);
