import assert from 'assert';

import {
  Size1d,
  Size2d,
  projectSize2dTo1d,
} from './Size';

export type Vector1d = number;

export interface Vector2d {
  x: number;
  y: number;
}

export function assertIsVec2dInBounds(bounds: Size2d, vec: Vector2d) {
  assert(0 <= vec.x && vec.x < bounds.width, `x should be in range [0..${bounds.width})`);
  assert(0 <= vec.y && vec.y < bounds.height, `y should be in range [0..${bounds.height})`);
}

export function assertIsVec1dInBounds(bounds: Size1d, vec: Vector1d) {
  assert(0 <= vec && vec < bounds, `value should be in [0..${bounds}) range`);
}

export function projectVec2dTo1d(size: Size2d, vec: Vector2d) {
  assertIsVec2dInBounds(size, vec);

  return vec.y * size.width + vec.x;
}

export function projectVec1dTo2d(size: Size2d, vec: Vector1d) {
  assertIsVec1dInBounds(projectSize2dTo1d(size), vec);

  return {
    y: Math.floor(vec / size.width),
    x: vec % size.width,
  };
}

export function addVec2d(vecA: Vector2d, vecB: Vector2d) {
  return {
    x: vecA.x + vecB.x,
    y: vecA.y + vecB.y,
  };
}

export function invertVec2d(vec: Vector2d): Vector2d {
  return {
    x: -vec.x,
    y: -vec.y,
  };
}

export function isVec2dInBounds(size: Size2d, vec: Vector2d) {
  return (
    (0 <= vec.x && vec.x < size.width) &&
    (0 <= vec.y && vec.y < size.height)
  );
}
