import { useEffect, useState } from "react";
import moment from "moment";
import {
  deleteChargeType,
  getAllChargeToday,
  getCharges,
} from "src/state/querys/Charges";

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
  const useGetChargesAllDay = (date) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchAndSet = async () => {
        const charges = await getAllChargeToday();
        setData(
          charges
            .filter(
              ({ CreatedAt, State }) =>
                moment(CreatedAt).format("YYYY-MM-DD") === date && State
            )
            .map(({ Charge, ChargeTypeID }) => ({
              amount: Charge,
              label: ChargeTypeID.Name,
            }))
        );
        setLoading(false);
      };
      fetchAndSet();
    }, [date]);
    return [data, loading];
  };
  const deleteCharge = (chargeID) =>
    deleteChargeType(chargeID).then(useGetCharges);

  return {
    useGetCharges,
    deleteCharge,
    useGetChargesAllDay,
  };
};

export default useCharge;
