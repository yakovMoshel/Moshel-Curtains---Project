import { useReducer } from "react";
import type {
  TableclothColorId,
  TableclothTypeId,
  TableShapeId,
} from "@/lib/data/tablecloth-products";

export interface TableclothConfiguratorSelections {
  typeId: TableclothTypeId | null;
  colorId: TableclothColorId | null;
  shapeId: TableShapeId | null;
  diameter: string;
  length: string;
  width: string;
}

export interface TableclothConfiguratorState {
  step: number;
  selections: TableclothConfiguratorSelections;
}

export const TABLECLOTH_STEP_COUNT = 3;

const INITIAL_STATE: TableclothConfiguratorState = {
  step: 0,
  selections: {
    typeId: null,
    colorId: null,
    shapeId: null,
    diameter: "",
    length: "",
    width: "",
  },
};

type Action =
  | { type: "SELECT_TYPE"; typeId: TableclothTypeId }
  | { type: "SELECT_COLOR"; colorId: TableclothColorId }
  | { type: "SELECT_SHAPE"; shapeId: TableShapeId }
  | { type: "SET_DIAMETER"; diameter: string }
  | { type: "SET_LENGTH"; length: string }
  | { type: "SET_WIDTH"; width: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

function reducer(state: TableclothConfiguratorState, action: Action): TableclothConfiguratorState {
  switch (action.type) {
    case "SELECT_TYPE":
      return { ...state, selections: { ...state.selections, typeId: action.typeId } };
    case "SELECT_COLOR":
      return { ...state, selections: { ...state.selections, colorId: action.colorId } };
    case "SELECT_SHAPE":
      return {
        ...state,
        selections: {
          ...state.selections,
          shapeId: action.shapeId,
          diameter: "",
          length: "",
          width: "",
        },
      };
    case "SET_DIAMETER":
      return { ...state, selections: { ...state.selections, diameter: action.diameter } };
    case "SET_LENGTH":
      return { ...state, selections: { ...state.selections, length: action.length } };
    case "SET_WIDTH":
      return { ...state, selections: { ...state.selections, width: action.width } };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, TABLECLOTH_STEP_COUNT - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    default:
      return state;
  }
}

export function useTableclothConfiguratorState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    step: state.step,
    selections: state.selections,
    selectType: (typeId: TableclothTypeId) => dispatch({ type: "SELECT_TYPE", typeId }),
    selectColor: (colorId: TableclothColorId) => dispatch({ type: "SELECT_COLOR", colorId }),
    selectShape: (shapeId: TableShapeId) => dispatch({ type: "SELECT_SHAPE", shapeId }),
    setDiameter: (diameter: string) => dispatch({ type: "SET_DIAMETER", diameter }),
    setLength: (length: string) => dispatch({ type: "SET_LENGTH", length }),
    setWidth: (width: string) => dispatch({ type: "SET_WIDTH", width }),
    goNext: () => dispatch({ type: "NEXT_STEP" }),
    goBack: () => dispatch({ type: "PREV_STEP" }),
  };
}
