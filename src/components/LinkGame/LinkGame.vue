<script setup>
import { computed, ref } from "vue";
import p5 from "p5";
import { forEach, uniqueId, cloneDeep, flatten } from "lodash";
import {
  imageNames,
  cells,
  checkIsConnectable,
  isSameCell,
  checkNeedShuffle,
  checkIsGameSuccess,
  shuffleGame,
  hint,
  newGame,
} from "./useLink";
let hintingCells;
const tempShow = ref([]);
const connectingLines = computed(() =>
  tempShow.value.filter((o) => o.type === "connectingLine").map((o) => o.value)
);
const pairEliminatedCells = computed(() =>
  tempShow.value.filter((o) => o.type === "pairEliminatedCell").map((o) => o.value)
);
function isPairEliminatedCell(cell) {
  return flatten(pairEliminatedCells.value).find((o) => isSameCell(o, cell));
}
const imageMaps = {};
new p5(function (p) {
  p.setup = function () {
    p.createCanvas(400, 700);
    const shuffleButton = p.createButton("洗牌");
    // console.log(shuffleButton.__proto__);
    // shuffleButton.style("fontSize", "14px");
    // shuffleButton.style("width", "80px");
    shuffleButton.position(50, 620);
    shuffleButton.mousePressed(shuffleGame);
    const hintButton = p.createButton("提示");
    hintButton.position(175, 620);
    hintButton.mousePressed(function () {
      hintingCells = hint();
      console.log(hintingCells);
    });
    const newGameButton = p.createButton("新游戏");
    newGameButton.position(300, 620);
    newGameButton.mousePressed(newGame);
  };

  p.preload = function () {
    imageNames.forEach((name) => {
      const url = new URL(`./assets/svg/${name}.svg`, import.meta.url).href;
      imageMaps[name] = p.loadImage(url);
      imageMaps[name].width = 10;
    });
  };

  p.draw = function () {
    cells.forEach((cell) => {
      p.strokeWeight(1);
      p.fill("white");
      const x = cell.x * 40;
      const y = cell.y * 40;
      if (cell.imgId) {
        if (hintingCells && hintingCells.find((hintCell) => isSameCell(hintCell, cell))) {
          p.fill("green");
        } else if (cell.active) {
          p.strokeWeight(2);
          p.stroke("red");
        } else {
          p.stroke("#eee");
        }
        p.rect(x, y, 40);
        p.image(imageMaps[cell.imgId], x + 5, y + 5);
      } else {
        const oldCell = isPairEliminatedCell(cell);
        if (oldCell) {
          p.stroke("pink");
          p.rect(x, y, 40);
          p.image(imageMaps[oldCell.imgId], x + 5, y + 5);
        } else {
          p.stroke("#eee");
          p.rect(x, y, 40);
        }
      }
      // p.text(`${cell.x},${cell.y}`, x + 10, y + 20);
    });
    forEach(connectingLines.value, (connectingLine) => {
      for (let i = 0; i <= connectingLine.length - 2; i++) {
        const dot1 = connectingLine[i];
        const dot2 = connectingLine[i + 1];
        p.stroke("#ffc107");
        p.strokeWeight(4);
        p.line(dot1.x * 40 + 20, dot1.y * 40 + 20, dot2.x * 40 + 20, dot2.y * 40 + 20);
      }
    });
    // TODO 洗牌时加个提示
    // p.stroke("red");
    // p.fill("rgba(255,255,255,0.8)");
    // p.rect(0, 0, 700, 410);
    // p.fill("red");
    // p.textSize(50);
    // p.text(`~洗牌中~`, 300, 200);
  };
  p.touchEnded = function () {
    const targetCell = cells.find(
      (cell) =>
        cell.imgId && p.collidePointRect(p.mouseX, p.mouseY, cell.x * 40, cell.y * 40, 40, 40)
    );
    if (targetCell) {
      hintingCells = null;
      const activeCell = cells.find((cell) => cell.active);
      if (activeCell) {
        if (isSameCell(targetCell, activeCell)) {
          return;
        }
        const checkIsConnectableRes = checkIsConnectable(activeCell, targetCell);
        if (checkIsConnectableRes) {
          addTempShow({ type: "connectingLine", value: checkIsConnectableRes, time: 200 });
          addTempShow({
            type: "pairEliminatedCell",
            value: [cloneDeep(activeCell), cloneDeep(targetCell)],
            time: 200,
          });
          activeCell.imgId = undefined;
          targetCell.imgId = undefined;
          if (checkIsGameSuccess()) {
            alert("赢了！");
          } else if (checkNeedShuffle()) {
            console.log("自动洗牌");
            shuffleGame();
          }
        } else {
          activeCell.active = false;
          targetCell.active = true;
        }
      } else {
        targetCell.active = true;
      }
    }
  };
}, "target");
function addTempShow(obj) {
  const id = uniqueId();
  tempShow.value.push({
    id,
    type: obj.type,
    value: obj.value,
  });
  setTimeout(() => {
    removeTempShow(id);
  }, obj.time);
}
function removeTempShow(id) {
  const index = tempShow.value.find((o) => o.id === id);
  tempShow.value.splice(index, 1);
}
</script>

<template>
  <div id="target" style="position: relative"></div>
</template>
