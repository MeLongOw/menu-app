export const formatMoney = (num) => {
    if (!Number(num)) return 0;
    return Number(Number(num).toFixed(1)).toLocaleString();
};
