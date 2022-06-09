import { useEffect, useState } from "react";
import { getClientsCount, getUserStates } from "src/state/querys/Users";

const useClient = () => {
  const useGetClientsOfState = () => {
    const [clients, setClients] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAndSet = async () => {
        const states = await getUserStates();
        const clientsSupabase = await Promise.all(
          states.map((state) => getClientsCount(state.ID, state.Name))
        );
        setClients(clientsSupabase);
        setLoading(false);
      };
      fetchAndSet();
    }, []);
    return [clients, loading];
  };

  return { useGetClientsOfState };
};

export { useClient };
