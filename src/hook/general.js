import { useSelector } from "react-redux";

import _ from "lodash";
const useKeySelector = (keys) =>
  useSelector((state) =>
    typeof keys === "string"
      ? state[keys]
      : keys.reduce(
          (prev, curr) => ({ ...prev, [curr]: _.get(state, curr.split(".")) }),
          {}
        )
  );

export { useKeySelector };
