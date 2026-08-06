import { useReducer } from "react";
import type { BlindColorId, BlindTypeId } from "@/lib/data/blind-products";

export interface BlindConfiguratorSelections {
  typeId: BlindTypeId | null;
  colorId: BlindColorId | null;
  width: string;
  height: string;
}

export interface BlindConfiguratorState {
  step: number;
  selections: BlindConfiguratorSelections;
}

export const BLIND_STEP_COUNT = 3;

const INITIAL_STATE: BlindConfiguratorState = {
  step: 0,
  selections: { typeId: null, colorId: null, width: "", height: "" },
};

type Action =
  | { type: "SELECT_TYPE"; typeId: BlindTypeId }
  | { type: "SELECT_COLOR"; colorId: BlindColorId }
  | { type: "SET_WIDTH"; width: string }
  | { type: "SET_HEIGHT"; height: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

function reducer(state: BlindConfiguratorState, action: Action): BlindConfiguratorState {
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
      return { ...state, step: Math.min(state.step + 1, BLIND_STEP_COUNT - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    default:
      return state;
  }
}

export function useBlindConfiguratorState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    step: state.step,
    selections: state.selections,
    selectType: (typeId: BlindTypeId) => dispatch({ type: "SELECT_TYPE", typeId }),
    selectColor: (colorId: BlindColorId) => dispatch({ type: "SELECT_COLOR", colorId }),
    setWidth: (width: string) => dispatch({ type: "SET_WIDTH", width }),
    setHeight: (height: string) => dispatch({ type: "SET_HEIGHT", height }),
    goNext: () => dispatch({ type: "NEXT_STEP" }),
    goBack: () => dispatch({ type: "PREV_STEP" }),
  };
}
