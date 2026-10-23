import type { BoardState, ColumnId } from "./types";

export function findColumnId(board: BoardState, id: string): ColumnId | undefined {
  const columnIds = Object.keys(board) as ColumnId[];
  if (Object.hasOwn(board, id)) return id as ColumnId;
  return columnIds.find((columnId) => board[columnId].some((task) => task.id === id));
}

export function findTask(board: BoardState, id: string) {
  for (const columnId of Object.keys(board) as ColumnId[]) {
    const task = board[columnId].find((item) => item.id === id);
    if (task) return task;
  }
  return undefined;
}
