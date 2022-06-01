import { useParams } from "react-router-dom";

import { useTask } from "src/hook/useTask";

const useClientInformationTemplate = () => {
  const { id: clientID } = useParams();

  const { useGetTaskByUserID } = useTask();
  const [tasksHistory, loadingTasksHistory] = useGetTaskByUserID(clientID);

  const isLoading = !loadingTasksHistory;
  return { isLoading, tasksHistory };
};

export default useClientInformationTemplate;
