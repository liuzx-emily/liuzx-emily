export function checkConnectable_ori(cell1, cell2) {
  if (cell1.imgId !== cell2.imgId) {
    return;
  }
  let flag = false;
  let turningPoints;
  let y = 0;
  while (!flag && y < 8) {
    // console.log(`--------------${y}`);
    turningPoints = [
      { x: cell1.x, y: y },
      { x: cell2.x, y },
    ];
    flag =
      goThroughVerticalLineFreely({ ...cell1, ignoreSelf: true }, { ...turningPoints[0] }) &&
      goThroughHorizontalLineFreely(
        { ...turningPoints[0], ignoreSelf: true },
        { ...turningPoints[1], ignoreSelf: true }
      ) &&
      goThroughVerticalLineFreely({ ...turningPoints[1] }, { ...cell2, ignoreSelf: true });
    y++;
  }
  let x = 0;
  while (!flag && x < 8) {
    // console.log(`--------------${x}`);
    turningPoints = [
      { x, y: cell1.y },
      { x, y: cell2.y },
    ];
    flag =
      goThroughHorizontalLineFreely({ ...cell1, ignoreSelf: true }, { ...turningPoints[0] }) &&
      goThroughVerticalLineFreely(
        { ...turningPoints[0], ignoreSelf: true },
        { ...turningPoints[1], ignoreSelf: true }
      ) &&
      goThroughHorizontalLineFreely({ ...turningPoints[1] }, { ...cell2, ignoreSelf: true });
    x++;
  }
  if (flag) {
    connectingLines = [cell1, ...turningPoints, cell2];
    console.log(connectingLines);
  } else {
    connectingLines = null;
  }
  return flag;
}

function goThroughHorizontalLineFreely(cell1, cell2) {
  if (isSameCell(cell1, cell2)) return true;
  const min = Math.min(cell1.x, cell2.x);
  const max = Math.max(cell1.x, cell2.x);
  const arr = [];
  for (let i = min + 1; i <= max - 1; i++) {
    arr.push({ x: i, y: cell1.y });
  }
  if (!cell1.ignoreSelf) {
    arr.push({ x: cell1.x, y: cell1.y });
  }
  if (!cell2.ignoreSelf) {
    arr.push({ x: cell2.x, y: cell2.y });
  }
  // console.log(`第${cell1.y}行，横着从${min}走到${max}，${isFreeCells(arr) ? "成功" : "失败"}`);
  return isFreeCells(arr);
}
function goThroughVerticalLineFreely(cell1, cell2) {
  if (isSameCell(cell1, cell2)) return true;
  const min = Math.min(cell1.y, cell2.y);
  const max = Math.max(cell1.y, cell2.y);
  const arr = [];
  for (let i = min + 1; i <= max - 1; i++) {
    arr.push({ x: cell1.x, y: i });
  }
  if (!cell1.ignoreSelf) {
    arr.push({ x: cell1.x, y: cell1.y });
  }
  if (!cell2.ignoreSelf) {
    arr.push({ x: cell2.x, y: cell2.y });
  }
  // console.log(`第${cell1.x}列，竖着从${min}走到${max}，${isFreeCells(arr) ? "成功" : "失败"}`);
  return isFreeCells(arr);
}
