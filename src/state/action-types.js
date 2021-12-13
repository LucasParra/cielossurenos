const actionsTypes = ["SET_SIDEBARSHOW", "SET_USER"].reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: curr,
  }),
  {}
);

export default actionsTypes;
