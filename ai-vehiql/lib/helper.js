export const serializeCarData =  (carData, wishlisted = false) => {
  return {
    ...carData,
    price: carData.price ? parseFloat(carData.price.toString()) : 0,
    createdAt: carData?.createdAt?.toISOString(),
    updatedAt: carData?.updatedAt?.toISOString(),
    wishlisted: wishlisted,
  };
};
