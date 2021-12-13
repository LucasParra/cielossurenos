import actionsTypes from "./action-types";

import { initialState } from "./initialState";

const middleHelpers = {
  SET_USER: (state, payload) => ({
    ...state,
    user: payload,
  }),
  SET_SIDEBARSHOW: (state, payload) => ({
    ...state,
    sidebarShow: payload,
  }),
};

const reducer = (state = initialState, action) => {
  const actionName = actionsTypes[action.type];
  if (actionName) return middleHelpers[actionName](state, action.payload);

  return state;
};

export default reducer;
