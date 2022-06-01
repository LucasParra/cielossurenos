import { useEffect, useState } from "react";

import { deleteChargeType, getCharges } from "src/state/querys/Charges";

const useCharge = () => {
  const useGetCharges = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchAndSet = async () => {
        const charges = await getCharges(1);
        setData(charges);
        setLoading(false);
      };
      fetchAndSet();
    }, []);
    return [data, loading];
  };
  const deleteCharge = (chargeID) =>
    deleteChargeType(chargeID).then(useGetCharges);

  return {
    useGetCharges,
    deleteCharge,
  };
};

export default useCharge;
