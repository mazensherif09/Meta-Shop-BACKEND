export const calcTotalPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;
  
    if (cart?.discount) {
      let totalPriceAfterDiscount =
        cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
      cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    }
  };