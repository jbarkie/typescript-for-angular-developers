export type SeatType = "window" | "middle" | "aisle" | "jump";

export function assertNever(value: never): never {
    throw new Error(`unhandled case: ${JSON.stringify(value)}`);
}

export const getSeatCost = (seat: SeatType) => {
  switch (seat) {
    case "aisle":
      return 100.23;
    case "middle":
      return 85.43;
    case "window":
      return 110.23;
    case 'jump':
        return 50;
    default:
      assertNever(seat); // every possible permutation / branch is being caught
      // if one is not caught, don't let the code compile!
  }
};
