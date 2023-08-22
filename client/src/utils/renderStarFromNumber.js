import icons from "src/libs/react-icons/icons";

const { AiFillStar, AiOutlineStar } = icons;

export const renderStarFromNumber = (num, size = 16) => {
    if (!Number(num)) num = 5;
    const stars = [];
    for (let i = 0; i < +num; i++)
        stars.push(<AiFillStar color="orange" size={size} />);
    for (let i = 5; i > +num; i--)
        stars.push(<AiOutlineStar color="orange" size={size} />);
    return stars?.map((item, index) => <span key={index}>{item}</span>);
};
