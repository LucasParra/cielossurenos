const actionsTypes = ["SET_SIDEBARSHOW", "SET_USER", "SET_TOAS"].reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: curr,
  }),
  {}
);

export default actionsTypes;
