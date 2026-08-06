import { useReducer } from "react";
import type {
  FurniturePieceId,
  UpholsteryColorId,
  UpholsteryTypeId,
} from "@/lib/data/upholstery-products";

export interface UpholsteryConfiguratorSelections {
  typeId: UpholsteryTypeId | null;
  colorId: UpholsteryColorId | null;
  furniturePieceId: FurniturePieceId | null;
}

export interface UpholsteryConfiguratorState {
  step: number;
  selections: UpholsteryConfiguratorSelections;
}

export const UPHOLSTERY_STEP_COUNT = 3;

const INITIAL_STATE: UpholsteryConfiguratorState = {
  step: 0,
  selections: { typeId: null, colorId: null, furniturePieceId: null },
};

type Action =
  | { type: "SELECT_TYPE"; typeId: UpholsteryTypeId }
  | { type: "SELECT_COLOR"; colorId: UpholsteryColorId }
  | { type: "SELECT_PIECE"; furniturePieceId: FurniturePieceId }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

function reducer(state: UpholsteryConfiguratorState, action: Action): UpholsteryConfiguratorState {
  switch (action.type) {
    case "SELECT_TYPE":
      return { ...state, selections: { ...state.selections, typeId: action.typeId } };
    case "SELECT_COLOR":
      return { ...state, selections: { ...state.selections, colorId: action.colorId } };
    case "SELECT_PIECE":
      return {
        ...state,
        selections: { ...state.selections, furniturePieceId: action.furniturePieceId },
      };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, UPHOLSTERY_STEP_COUNT - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    default:
      return state;
  }
}

export function useUpholsteryConfiguratorState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    step: state.step,
    selections: state.selections,
    selectType: (typeId: UpholsteryTypeId) => dispatch({ type: "SELECT_TYPE", typeId }),
    selectColor: (colorId: UpholsteryColorId) => dispatch({ type: "SELECT_COLOR", colorId }),
    selectPiece: (furniturePieceId: FurniturePieceId) =>
      dispatch({ type: "SELECT_PIECE", furniturePieceId }),
    goNext: () => dispatch({ type: "NEXT_STEP" }),
    goBack: () => dispatch({ type: "PREV_STEP" }),
  };
}
