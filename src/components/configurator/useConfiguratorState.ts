import { useReducer } from "react";
import type { CurtainColorId, CurtainTypeId } from "@/lib/data/curtain-products";

export interface ConfiguratorSelections {
  typeId: CurtainTypeId | null;
  colorId: CurtainColorId | null;
  width: string;
  height: string;
}

export interface ConfiguratorState {
  step: number;
  selections: ConfiguratorSelections;
}

export const STEP_COUNT = 3;

const INITIAL_STATE: ConfiguratorState = {
  step: 0,
  selections: { typeId: null, colorId: null, width: "", height: "" },
};

type Action =
  | { type: "SELECT_TYPE"; typeId: CurtainTypeId }
  | { type: "SELECT_COLOR"; colorId: CurtainColorId }
  | { type: "SET_WIDTH"; width: string }
  | { type: "SET_HEIGHT"; height: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case "SELECT_TYPE":
      return { ...state, selections: { ...state.selections, typeId: action.typeId } };
    case "SELECT_COLOR":
      return { ...state, selections: { ...state.selections, colorId: action.colorId } };
    case "SET_WIDTH":
      return { ...state, selections: { ...state.selections, width: action.width } };
    case "SET_HEIGHT":
      return { ...state, selections: { ...state.selections, height: action.height } };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, STEP_COUNT - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    default:
      return state;
  }
}

export function useConfiguratorState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    step: state.step,
    selections: state.selections,
    selectType: (typeId: CurtainTypeId) => dispatch({ type: "SELECT_TYPE", typeId }),
    selectColor: (colorId: CurtainColorId) => dispatch({ type: "SELECT_COLOR", colorId }),
    setWidth: (width: string) => dispatch({ type: "SET_WIDTH", width }),
    setHeight: (height: string) => dispatch({ type: "SET_HEIGHT", height }),
    goNext: () => dispatch({ type: "NEXT_STEP" }),
    goBack: () => dispatch({ type: "PREV_STEP" }),
  };
}
