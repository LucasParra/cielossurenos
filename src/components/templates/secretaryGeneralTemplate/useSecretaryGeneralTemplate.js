import { useClient } from "src/hook/useClient";
import { useTask } from "src/hook/useTask";

const useSecretaryGeneralTemplate = () => {
  const { useGetTasksOfState } = useTask();
  const [tasks, loadingTasksHistory] = useGetTasksOfState();
  const { useGetClientsOfState } = useClient();
  const [clients, loadingClient] = useGetClientsOfState();

  const isLoading = !loadingTasksHistory && !loadingClient;
  return { isLoading, tasks, clients };
};

export default useSecretaryGeneralTemplate;
