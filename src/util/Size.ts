export type Size1d = number;

export interface Size2d {
  width: number;
  height: number;
}

export function projectSize2dTo1d(size: Size2d) {
  return size.width * size.height;
}
