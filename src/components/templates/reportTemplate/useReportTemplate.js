import useCharge from "src/hook/useCharge";
import { useTask } from "src/hook/useTask";

const useReportTemplate = (date) => {
  const { useGetTasksOfState } = useTask();
  const [tasks, isLoadingTask] = useGetTasksOfState();
  const { useGetChargesAllDay } = useCharge();
  const [charges, isLoadingCharges] = useGetChargesAllDay(date);

  const isLoading = !isLoadingTask && !isLoadingCharges;

  const filterTask = (taskType, state) =>
    tasks
      .filter(({ ID }) => (state ? ID === state : true))
      .map(
        ({ Task }) =>
          Task.filter(
            ({ TypeID, DeadLine }) => TypeID === taskType && DeadLine === date
          ).length
      )
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  const newContractsTodayCount = filterTask(1);
  const reconnectionTodayCount = filterTask(17, 2);
  const disconnectionTodayCount = filterTask(4, 2);
  const facilityTodayCount = filterTask(1, 2);

  return {
    newContractsTodayCount,
    reconnectionTodayCount,
    disconnectionTodayCount,
    facilityTodayCount,
    isLoading,
    paymentsToday: charges,
  };
};

export default useReportTemplate;
