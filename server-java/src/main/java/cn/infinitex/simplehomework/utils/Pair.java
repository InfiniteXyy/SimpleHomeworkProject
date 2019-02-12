package cn.infinitex.simplehomework.utils;

import lombok.Value;

@Value
public class Pair<T> {
  T left;
  T right;
}