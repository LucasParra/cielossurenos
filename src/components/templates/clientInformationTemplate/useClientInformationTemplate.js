import { useParams } from "react-router-dom";

import { useTask } from "src/hook/useTask";

const useClientInformationTemplate = () => {
  const { id: clientID } = useParams();

  const { useGetTaskByUserID } = useTask();
  const [tasks, loadingTasksHistory] = useGetTaskByUserID(clientID);

  const isLoading = !loadingTasksHistory;
  return { isLoading, tasks };
};

export default useClientInformationTemplate;
