export function modeOfArray(array: string[]) {
  if (array.length === 0) {
    return [];
  }

  let modeMap: { [key: string]: number } = {},
      maxCount = 1, 
      modes: string[] = [];

  array.forEach(el => {
    if (modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }

    if (modeMap[el] > maxCount) {
      modes = [el];
      maxCount = modeMap[el];
    } else if (modeMap[el] === maxCount) {
      modes.push(el);
      maxCount = modeMap[el];
    }
  });

  return modes;
};