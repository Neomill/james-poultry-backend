export const getStockStatus = (qty: number, stock_alert_ctr: number) => {
  let status =
    qty === 0
      ? "OUT_OF_STOCK"
      : qty <= stock_alert_ctr
      ? "LOW_STOCK"
      : "IN_STOCK";

  return status;
};

export const getItemCondition = (expiry_date?: any) => {
  if (expiry_date !== undefined) {
    if (new Date(Date.now()).getTime() > new Date(expiry_date).getTime()) {
      return "EXPIRED";
    }
  }
  return "GOOD";
};
