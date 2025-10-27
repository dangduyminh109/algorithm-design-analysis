import { CodeLanguage } from '@/types/algorithm';

export type AlgorithmCodeMap = Record<string, Partial<Record<CodeLanguage, string>>>;

export const ALGORITHM_CODE_SAMPLES: AlgorithmCodeMap = {
  'bubble-sort': {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    java: `public static void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
    cpp: `#include <vector>
#include <algorithm>

void bubbleSort(std::vector<int>& arr) {
  int n = static_cast<int>(arr.size());
  for (int i = 0; i < n - 1; ++i) {
    for (int j = 0; j < n - i - 1; ++j) {
      if (arr[j] > arr[j + 1]) {
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
}`,
    csharp: `public static void BubbleSort(int[] arr) {
  int n = arr.Length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
    c: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; ++i) {
    for (int j = 0; j < n - i - 1; ++j) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
  },
  'selection-sort': {
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`,
    java: `public static void selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int minIndex = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      int temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
}`,
    cpp: `#include <vector>
#include <algorithm>

void selectionSort(std::vector<int>& arr) {
  int n = static_cast<int>(arr.size());
  for (int i = 0; i < n - 1; ++i) {
    int minIndex = i;
    for (int j = i + 1; j < n; ++j) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      std::swap(arr[i], arr[minIndex]);
    }
  }
}`,
    csharp: `public static void SelectionSort(int[] arr) {
  int n = arr.Length;
  for (int i = 0; i < n - 1; i++) {
    int minIndex = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      int temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
}`,
    c: `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; ++i) {
    int minIndex = i;
    for (int j = i + 1; j < n; ++j) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      int temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr`
  },
  'insertion-sort': {
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    java: `public static void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
    cpp: `#include <vector>

void insertionSort(std::vector<int>& arr) {
  for (int i = 1; i < static_cast<int>(arr.size()); ++i) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      --j;
    }
    arr[j + 1] = key;
  }
}`,
    csharp: `public static void InsertionSort(int[] arr) {
  for (int i = 1; i < arr.Length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
    c: `void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; ++i) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      --j;
    }
    arr[j + 1] = key;
  }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
  },
  'quick-sort': {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    java: `public static void quickSort(int[] arr, int low, int high) {
  if (low < high) {
    int pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
}

private static int partition(int[] arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  int temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}`,
    cpp: `#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; ++j) {
    if (arr[j] <= pivot) {
      ++i;
      std::swap(arr[i], arr[j]);
    }
  }
  std::swap(arr[i + 1], arr[high]);
  return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
  if (low < high) {
    int pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
}`,
    csharp: `public static void QuickSort(int[] arr, int low, int high) {
  if (low < high) {
    int pivotIndex = Partition(arr, low, high);
    QuickSort(arr, low, pivotIndex - 1);
    QuickSort(arr, pivotIndex + 1, high);
  }
}

private static int Partition(int[] arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  int swap = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = swap;
  return i + 1;
}`,
    c: `int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; ++j) {
    if (arr[j] <= pivot) {
      ++i;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  int temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    return arr


def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
  },
  'merge-sort': {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    java: `public static int[] mergeSort(int[] arr) {
  if (arr.length <= 1) {
    return arr;
  }
  int mid = arr.length / 2;
  int[] left = Arrays.copyOfRange(arr, 0, mid);
  int[] right = Arrays.copyOfRange(arr, mid, arr.length);
  return merge(mergeSort(left), mergeSort(right));
}

private static int[] merge(int[] left, int[] right) {
  int[] result = new int[left.length + right.length];
  int i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result[k++] = left[i++];
    } else {
      result[k++] = right[j++];
    }
  }
  while (i < left.length) {
    result[k++] = left[i++];
  }
  while (j < right.length) {
    result[k++] = right[j++];
  }
  return result;
}`,
    cpp: `#include <vector>

std::vector<int> merge(const std::vector<int>& left, const std::vector<int>& right) {
  std::vector<int> result;
  result.reserve(left.size() + right.size());
  size_t i = 0, j = 0;
  while (i < left.size() && j < right.size()) {
    if (left[i] <= right[j]) {
      result.push_back(left[i++]);
    } else {
      result.push_back(right[j++]);
    }
  }
  while (i < left.size()) {
    result.push_back(left[i++]);
  }
  while (j < right.size()) {
    result.push_back(right[j++]);
  }
  return result;
}

std::vector<int> mergeSort(const std::vector<int>& arr) {
  if (arr.size() <= 1) {
    return arr;
  }
  size_t mid = arr.size() / 2;
  std::vector<int> left(arr.begin(), arr.begin() + mid);
  std::vector<int> right(arr.begin() + mid, arr.end());
  return merge(mergeSort(left), mergeSort(right));
}`,
    csharp: `public static int[] MergeSort(int[] arr) {
  if (arr.Length <= 1) {
    return arr;
  }
  int mid = arr.Length / 2;
  int[] left = arr.Take(mid).ToArray();
  int[] right = arr.Skip(mid).ToArray();
  return Merge(MergeSort(left), MergeSort(right));
}

private static int[] Merge(int[] left, int[] right) {
  int[] result = new int[left.Length + right.Length];
  int i = 0, j = 0, k = 0;
  while (i < left.Length && j < right.Length) {
    if (left[i] <= right[j]) {
      result[k++] = left[i++];
    } else {
      result[k++] = right[j++];
    }
  }
  while (i < left.Length) {
    result[k++] = left[i++];
  }
  while (j < right.Length) {
    result[k++] = right[j++];
  }
  return result;
}`,
    c: `#include <stdlib.h>

static void merge(int arr[], int left[], int leftSize, int right[], int rightSize) {
  int i = 0, j = 0, k = 0;
  while (i < leftSize && j < rightSize) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }
  while (i < leftSize) {
    arr[k++] = left[i++];
  }
  while (j < rightSize) {
    arr[k++] = right[j++];
  }
}

void mergeSort(int arr[], int n) {
  if (n <= 1) {
    return;
  }
  int mid = n / 2;
  int* left = (int*)malloc(mid * sizeof(int));
  int* right = (int*)malloc((n - mid) * sizeof(int));
  for (int i = 0; i < mid; ++i) {
    left[i] = arr[i];
  }
  for (int i = mid; i < n; ++i) {
    right[i - mid] = arr[i];
  }
  mergeSort(left, mid);
  mergeSort(right, n - mid);
  merge(arr, left, mid, right, n - mid);
  free(left);
  free(right);
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
  },
  'linear-search': {
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
    java: `public static int linearSearch(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}`,
    cpp: `#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
  for (size_t i = 0; i < arr.size(); ++i) {
    if (arr[i] == target) {
      return static_cast<int>(i);
    }
  }
  return -1;
}`,
    csharp: `public static int LinearSearch(int[] arr, int target) {
  for (int i = 0; i < arr.Length; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}`,
    c: `int linearSearch(const int arr[], int n, int target) {
  for (int i = 0; i < n; ++i) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;
}`,
    python: `def linear_search(arr, target):
    for index, value in enumerate(arr):
        if value == target:
            return index
    return -1`
  },
  'binary-search': {
    javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    java: `public static int binarySearch(int[] arr, int target) {
  int left = 0;
  int right = arr.length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    cpp: `#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
  int left = 0;
  int right = static_cast<int>(arr.size()) - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    csharp: `public static int BinarySearch(int[] arr, int target) {
  int left = 0;
  int right = arr.Length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    c: `int binarySearch(const int arr[], int n, int target) {
  int left = 0;
  int right = n - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  },
  'linear-min-max': {
    javascript: `function findMinMax(arr) {
  if (arr.length === 0) return null;
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return { min, max };
}`,
    java: `public static int[] findMinMax(int[] arr) {
  if (arr.length == 0) {
    throw new IllegalArgumentException("Array must not be empty");
  }
  int min = arr[0];
  int max = arr[0];
  for (int i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return new int[] { min, max };
}`,
    cpp: `#include <vector>
#include <stdexcept>
#include <utility>

std::pair<int, int> findMinMax(const std::vector<int>& arr) {
  if (arr.empty()) {
    throw std::invalid_argument("Array must not be empty");
  }
  int min = arr[0];
  int max = arr[0];
  for (size_t i = 1; i < arr.size(); ++i) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return {min, max};
}`,
    csharp: `public static (int min, int max) FindMinMax(int[] arr) {
  if (arr.Length == 0) {
    throw new ArgumentException("Array must not be empty");
  }
  int min = arr[0];
  int max = arr[0];
  for (int i = 1; i < arr.Length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return (min, max);
}`,
    c: `#include <limits.h>

struct MinMax {
  int min;
  int max;
};

struct MinMax findMinMax(const int arr[], int n) {
  struct MinMax result;
  if (n <= 0) {
    result.min = result.max = 0;
    return result;
  }
  result.min = arr[0];
  result.max = arr[0];
  for (int i = 1; i < n; ++i) {
    if (arr[i] < result.min) {
      result.min = arr[i];
    }
    if (arr[i] > result.max) {
      result.max = arr[i];
    }
  }
  return result;
}`,
    python: `def find_min_max(arr):
    if not arr:
        return None
    current_min = current_max = arr[0]
    for value in arr[1:]:
        if value < current_min:
            current_min = value
        if value > current_max:
            current_max = value
    return {"min": current_min, "max": current_max}`
  },
  'tournament-method': {
    javascript: `function tournamentMinMax(arr) {
  if (arr.length === 0) return null;
  if (arr.length === 1) return { min: arr[0], max: arr[0] };

  function helper(start, end) {
    if (start === end) {
      return { min: arr[start], max: arr[start] };
    }
    if (end - start === 1) {
      return {
        min: Math.min(arr[start], arr[end]),
        max: Math.max(arr[start], arr[end])
      };
    }
    const mid = Math.floor((start + end) / 2);
    const left = helper(start, mid);
    const right = helper(mid + 1, end);
    return {
      min: Math.min(left.min, right.min),
      max: Math.max(left.max, right.max)
    };
  }

  return helper(0, arr.length - 1);
}`,
    java: `public static int[] tournamentMinMax(int[] arr) {
  if (arr.length == 0) {
    throw new IllegalArgumentException("Array must not be empty");
  }
  if (arr.length == 1) {
    return new int[] { arr[0], arr[0] };
  }
  return helper(arr, 0, arr.length - 1);
}

private static int[] helper(int[] arr, int start, int end) {
  if (start == end) {
    return new int[] { arr[start], arr[start] };
  }
  if (end - start == 1) {
    int min = Math.min(arr[start], arr[end]);
    int max = Math.max(arr[start], arr[end]);
    return new int[] { min, max };
  }
  int mid = (start + end) / 2;
  int[] left = helper(arr, start, mid);
  int[] right = helper(arr, mid + 1, end);
  return new int[] {
    Math.min(left[0], right[0]),
    Math.max(left[1], right[1])
  };
}`,
    cpp: `#include <vector>
#include <stdexcept>
#include <algorithm>

std::pair<int, int> tournamentHelper(const std::vector<int>& arr, int start, int end) {
  if (start == end) {
    return {arr[start], arr[start]};
  }
  if (end - start == 1) {
    int minVal = std::min(arr[start], arr[end]);
    int maxVal = std::max(arr[start], arr[end]);
    return {minVal, maxVal};
  }
  int mid = (start + end) / 2;
  auto left = tournamentHelper(arr, start, mid);
  auto right = tournamentHelper(arr, mid + 1, end);
  return {std::min(left.first, right.first), std::max(left.second, right.second)};
}

std::pair<int, int> tournamentMinMax(const std::vector<int>& arr) {
  if (arr.empty()) {
    throw std::invalid_argument("Array must not be empty");
  }
  if (arr.size() == 1) {
    return {arr[0], arr[0]};
  }
  return tournamentHelper(arr, 0, static_cast<int>(arr.size()) - 1);
}`,
    csharp: `public static (int min, int max) TournamentMinMax(int[] arr) {
  if (arr.Length == 0) {
    throw new ArgumentException("Array must not be empty");
  }
  if (arr.Length == 1) {
    return (arr[0], arr[0]);
  }
  return Helper(arr, 0, arr.Length - 1);
}

private static (int min, int max) Helper(int[] arr, int start, int end) {
  if (start == end) {
    return (arr[start], arr[start]);
  }
  if (end - start == 1) {
    int min = Math.Min(arr[start], arr[end]);
    int max = Math.Max(arr[start], arr[end]);
    return (min, max);
  }
  int mid = (start + end) / 2;
  var left = Helper(arr, start, mid);
  var right = Helper(arr, mid + 1, end);
  return (Math.Min(left.min, right.min), Math.Max(left.max, right.max));
}`,
    c: `#include <stdlib.h>
#include <limits.h>

struct MinMax tournamentHelper(const int arr[], int start, int end) {
  if (start == end) {
    struct MinMax result = { arr[start], arr[start] };
    return result;
  }
  if (end - start == 1) {
    struct MinMax result;
    if (arr[start] < arr[end]) {
      result.min = arr[start];
      result.max = arr[end];
    } else {
      result.min = arr[end];
      result.max = arr[start];
    }
    return result;
  }
  int mid = (start + end) / 2;
  struct MinMax left = tournamentHelper(arr, start, mid);
  struct MinMax right = tournamentHelper(arr, mid + 1, end);
  struct MinMax result;
  result.min = left.min < right.min ? left.min : right.min;
  result.max = left.max > right.max ? left.max : right.max;
  return result;
}

struct MinMax tournamentMinMax(const int arr[], int n) {
  struct MinMax result = { INT_MAX, INT_MIN };
  if (n <= 0) {
    return result;
  }
  return tournamentHelper(arr, 0, n - 1);
}`,
    python: `def tournament_min_max(arr):
    if not arr:
        return None
    if len(arr) == 1:
        return {"min": arr[0], "max": arr[0]}

    def helper(start, end):
        if start == end:
            return arr[start], arr[start]
        if end - start == 1:
            return (min(arr[start], arr[end]), max(arr[start], arr[end]))
        mid = (start + end) // 2
        left_min, left_max = helper(start, mid)
        right_min, right_max = helper(mid + 1, end)
        return (min(left_min, right_min), max(left_max, right_max))

    minimum, maximum = helper(0, len(arr) - 1)
    return {"min": minimum, "max": maximum}`
  },
  'jump-search': {
    javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  // Jump to find the block where element may be present
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  // Linear search in the identified block
  while (arr[prev] < target) {
    prev++;
    if (prev == Math.min(step, n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`,
    python: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    # Jump to find the block
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    
    # Linear search in block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    
    if arr[prev] == target:
        return prev
    return -1`,
    java: `public static int jumpSearch(int[] arr, int target) {
  int n = arr.length;
  int step = (int) Math.sqrt(n);
  int prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += (int) Math.sqrt(n);
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev == Math.min(step, n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`,
    cpp: `#include <cmath>

int jumpSearch(const std::vector<int>& arr, int target) {
  int n = arr.size();
  int step = std::sqrt(n);
  int prev = 0;
  
  while (arr[std::min(step, n) - 1] < target) {
    prev = step;
    step += std::sqrt(n);
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev == std::min(step, n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`,
    csharp: `public static int JumpSearch(int[] arr, int target) {
  int n = arr.Length;
  int step = (int)Math.Sqrt(n);
  int prev = 0;
  
  while (arr[Math.Min(step, n) - 1] < target) {
    prev = step;
    step += (int)Math.Sqrt(n);
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev == Math.Min(step, n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`,
    c: `#include <math.h>

int jumpSearch(const int arr[], int n, int target) {
  int step = (int)sqrt(n);
  int prev = 0;
  
  while (arr[(step < n ? step : n) - 1] < target) {
    prev = step;
    step += (int)sqrt(n);
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev == (step < n ? step : n)) return -1;
  }
  
  if (arr[prev] == target) return prev;
  return -1;
}`
  },
  'interpolation-search': {
    javascript: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    // Interpolation formula
    const pos = low + Math.floor(
      ((high - low) / (arr[high] - arr[low])) * (target - arr[low])
    );
    
    if (arr[pos] == target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    python: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target:
                return low
            return -1
        
        # Interpolation formula
        pos = low + int(
            ((high - low) / (arr[high] - arr[low])) * (target - arr[low])
        )
        
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    
    return -1`,
    java: `public static int interpolationSearch(int[] arr, int target) {
  int low = 0;
  int high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    int pos = low + (int)(
      ((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low])
    );
    
    if (arr[pos] == target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    cpp: `int interpolationSearch(const std::vector<int>& arr, int target) {
  int low = 0;
  int high = arr.size() - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    int pos = low + static_cast<int>(
      (static_cast<double>(high - low) / (arr[high] - arr[low])) * (target - arr[low])
    );
    
    if (arr[pos] == target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    csharp: `public static int InterpolationSearch(int[] arr, int target) {
  int low = 0;
  int high = arr.Length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    int pos = low + (int)(
      ((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low])
    );
    
    if (arr[pos] == target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    c: `int interpolationSearch(const int arr[], int n, int target) {
  int low = 0;
  int high = n - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    int pos = low + (int)(
      ((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low])
    );
    
    if (arr[pos] == target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`
  },
  'divide-conquer-minmax': {
    javascript: `function divideConquerMinMax(arr, low = 0, high = arr.length - 1) {
  // Base case: one element
  if (low == high) {
    return { min: arr[low], max: arr[low] };
  }
  
  // Base case: two elements
  if (high == low + 1) {
    if (arr[low] < arr[high]) {
      return { min: arr[low], max: arr[high] };
    } else {
      return { min: arr[high], max: arr[low] };
    }
  }
  
  // Divide and conquer
  const mid = Math.floor((low + high) / 2);
  const left = divideConquerMinMax(arr, low, mid);
  const right = divideConquerMinMax(arr, mid + 1, high);
  
  return {
    min: Math.min(left.min, right.min),
    max: Math.max(left.max, right.max)
  };
}`,
    python: `def divide_conquer_minmax(arr, low=None, high=None):
    if low is None:
        low = 0
    if high is None:
        high = len(arr) - 1
    
    # Base case: one element
    if low == high:
        return {"min": arr[low], "max": arr[low]}
    
    # Base case: two elements
    if high == low + 1:
        if arr[low] < arr[high]:
            return {"min": arr[low], "max": arr[high]}
        else:
            return {"min": arr[high], "max": arr[low]}
    
    # Divide and conquer
    mid = (low + high) // 2
    left = divide_conquer_minmax(arr, low, mid)
    right = divide_conquer_minmax(arr, mid + 1, high)
    
    return {
        "min": min(left["min"], right["min"]),
        "max": max(left["max"], right["max"])
    }`,
    java: `class MinMaxResult {
  int min, max;
  MinMaxResult(int min, int max) {
    this.min = min;
    this.max = max;
  }
}

public static MinMaxResult divideConquerMinMax(int[] arr, int low, int high) {
  // Base case: one element
  if (low == high) {
    return new MinMaxResult(arr[low], arr[low]);
  }
  
  // Base case: two elements
  if (high == low + 1) {
    if (arr[low] < arr[high]) {
      return new MinMaxResult(arr[low], arr[high]);
    } else {
      return new MinMaxResult(arr[high], arr[low]);
    }
  }
  
  // Divide and conquer
  int mid = (low + high) / 2;
  MinMaxResult left = divideConquerMinMax(arr, low, mid);
  MinMaxResult right = divideConquerMinMax(arr, mid + 1, high);
  
  return new MinMaxResult(
    Math.min(left.min, right.min),
    Math.max(left.max, right.max)
  );
}`,
    cpp: `struct MinMaxResult {
  int min, max;
};

MinMaxResult divideConquerMinMax(const std::vector<int>& arr, int low, int high) {
  // Base case: one element
  if (low == high) {
    return {arr[low], arr[low]};
  }
  
  // Base case: two elements
  if (high == low + 1) {
    if (arr[low] < arr[high]) {
      return {arr[low], arr[high]};
    } else {
      return {arr[high], arr[low]};
    }
  }
  
  // Divide and conquer
  int mid = (low + high) / 2;
  MinMaxResult left = divideConquerMinMax(arr, low, mid);
  MinMaxResult right = divideConquerMinMax(arr, mid + 1, high);
  
  return {
    std::min(left.min, right.min),
    std::max(left.max, right.max)
  };
}`,
    csharp: `public class MinMaxResult {
  public int Min { get; set; }
  public int Max { get; set; }
  
  public MinMaxResult(int min, int max) {
    Min = min;
    Max = max;
  }
}

public static MinMaxResult DivideConquerMinMax(int[] arr, int low, int high) {
  // Base case: one element
  if (low == high) {
    return new MinMaxResult(arr[low], arr[low]);
  }
  
  // Base case: two elements
  if (high == low + 1) {
    if (arr[low] < arr[high]) {
      return new MinMaxResult(arr[low], arr[high]);
    } else {
      return new MinMaxResult(arr[high], arr[low]);
    }
  }
  
  // Divide and conquer
  int mid = (low + high) / 2;
  MinMaxResult left = DivideConquerMinMax(arr, low, mid);
  MinMaxResult right = DivideConquerMinMax(arr, mid + 1, high);
  
  return new MinMaxResult(
    Math.Min(left.Min, right.Min),
    Math.Max(left.Max, right.Max)
  );
}`,
    c: `struct MinMaxResult {
  int min;
  int max;
};

struct MinMaxResult divideConquerMinMax(const int arr[], int low, int high) {
  struct MinMaxResult result;
  
  // Base case: one element
  if (low == high) {
    result.min = arr[low];
    result.max = arr[low];
    return result;
  }
  
  // Base case: two elements
  if (high == low + 1) {
    if (arr[low] < arr[high]) {
      result.min = arr[low];
      result.max = arr[high];
    } else {
      result.min = arr[high];
      result.max = arr[low];
    }
    return result;
  }
  
  // Divide and conquer
  int mid = (low + high) / 2;
  struct MinMaxResult left = divideConquerMinMax(arr, low, mid);
  struct MinMaxResult right = divideConquerMinMax(arr, mid + 1, high);
  
  result.min = left.min < right.min ? left.min : right.min;
  result.max = left.max > right.max ? left.max : right.max;
  return result;
}`
  }
};
