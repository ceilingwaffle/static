let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let leaderboardBox = document.getElementById("leaderboard");

socket.onopen = () => {
  console.log("Successfully Connected");
};

socket.onclose = (event) => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};

socket.onerror = (error) => {
  console.log("Socket Error: ", error);
};

let animation = {
  acc: new CountUp("accdata", 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
  combo: new CountUp("combodata", 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
};

let previousOurPlayer;

socket.onmessage = (event) => {
  let data = JSON.parse(event.data);
  let isVisible = data.gameplay.leaderboard.isVisible;
  console.log("isVisible", isVisible);
  if (!isVisible) {
    leaderboardBox.style.opacity = 1.0;
  } else {
    leaderboardBox.style.opacity = 0.0;
  }
  let ourPlayer = data.gameplay.leaderboard.ourplayer;
  let currentPlayerSlots = data.gameplay.leaderboard.slots;

  if (!currentPlayerSlots?.length || !ourPlayer) {
    return;
  }

  let leaderboxPlayerNodes = leaderboardBox.querySelectorAll(".lbPlayer");

  if (!leaderboxPlayerNodes.length) {
    // render initial leaderboard
    currentPlayerSlots.forEach((playerSlot) => {
      let playerNode = document.createElement("div");
      playerNode.innerHTML = generateLeaderboardPlayerInnerHtml(playerSlot);
      playerNode.classList.add("lbPlayer");
      leaderboardBox.appendChild(playerNode);
    });
    createBoxes();
  } else {
    const newPosition = ourPlayer.position;
    const oldPosition = previousOurPlayer?.position || newPosition;
    const playerNode = leaderboardBox.querySelectorAll(".lbPlayer")[oldPosition - 1];

    // update ourPlayer values
    playerNode.innerHTML = generateLeaderboardPlayerInnerHtml(ourPlayer);
    console.log("newPosition", newPosition);
    console.log("oldPosition", oldPosition);

    // update existing leaderboard
    if (newPosition !== oldPosition) {
      // const targetNode = leaderboardBox.querySelectorAll(".lbPlayer")[newPosition - 1];
      // movePlayerDiv(playerNode, newPosition, oldPosition);
      layout(newPosition, oldPosition);
    }
  }

  previousOurPlayer = data.gameplay.leaderboard.ourplayer;
};

function generateLeaderboardPlayerInnerHtml(playerSlot) {
  return `
    <div class="lbPlayerName" data-value="${playerSlot.name}">${playerSlot.name}</div>
    <div class="lbPlayerPosition" data-value="${playerSlot.position}">${playerSlot.position}</div>
    <div class="lbPlayerScore" data-value="${playerSlot.score}">${playerSlot.score}</div>
    <div class="lbPlayerCombo" data-value="${playerSlot.combo}">${playerSlot.combo}</div>`;
}

// function movePlayerDiv(playerNode, targetPosition, oldPosition) {
//   nodeInTargetPosition = playerNode.parentNode.querySelectorAll(".lbPlayer")[targetPosition - 1];
//   nodeInOldPosition = playerNode.parentNode.querySelectorAll(".lbPlayer")[oldPosition - 1];
//   nodeInTargetPosition.before(playerNode);
//   console.log(nodeInTargetPosition.querySelector('.lbPlayerName'));
//   nodeInTargetPosition.innerHTML = generateLeaderboardPlayerInnerHtml({
//     name: nodeInTargetPosition.querySelector('.lbPlayerName').getAttribute('data-value'),
//     position: oldPosition,
//     score: nodeInTargetPosition.querySelector('.lbPlayerScore').getAttribute('data-value'),
//     combo: nodeInTargetPosition.querySelector('.lbPlayerCombo').getAttribute('data-value')
//   });
//   window.getComputedStyle(nodeInTargetPosition).opacity;
// }

var group = document.querySelector("#leaderboard");
// var nodes = document.querySelectorAll(".lbPlayer");
// var total = nodes.length;
var ease = Power1.easeInOut;
var boxes = [];

function createBoxes() {
  boxes = [];
  var nodes = document.querySelectorAll(".lbPlayer");
  var total = nodes.length;
  for (var i = 0; i < total; i++) {
    var node = nodes[i];

    // Initialize transforms on node
    TweenLite.set(node, { x: 0 });

    boxes[i] = {
      transform: node._gsTransform,
      x: node.offsetLeft,
      y: node.offsetTop,
      node,
    };

    boxes[i].node.style.order = i + 1;

    boxes[i].node.innerHTML = generateLeaderboardPlayerInnerHtml({
      name: boxes[i].node.querySelector(".lbPlayerName").getAttribute("data-value"),
      position: i + 1,
      score: boxes[i].node.querySelector(".lbPlayerScore").getAttribute("data-value"),
      combo: boxes[i].node.querySelector(".lbPlayerCombo").getAttribute("data-value"),
    });
  }
}

function layout(newPosition, oldPosition) {
  var nodes = document.querySelectorAll(".lbPlayer");
  var total = nodes.length;

  // group.classList.toggle("reorder");

  //   for (var i = 0; i < total; i++) {

  //     var box = boxes[i];

  //     box.node.style.order = box.node.querySelector('.lbPlayerPosition').getAttribute('data-value');

  //     var lastX = box.x;
  //     var lastY = box.y;

  //     box.x = box.node.offsetLeft;
  //     box.y = box.node.offsetTop;

  //     // Continue if box hasn't moved
  //     if (lastX === box.x && lastY === box.y) continue;

  //     // Reversed delta values taking into account current transforms
  //     var x = box.transform.x + lastX - box.x;
  //     var y = box.transform.y + lastY - box.y;

  //     box.node.innerHTML = generateLeaderboardPlayerInnerHtml({
  //       name: box.node.querySelector('.lbPlayerName').getAttribute('data-value'),
  //       position: i + 1,
  //       score: box.node.querySelector('.lbPlayerScore').getAttribute('data-value'),
  //       combo: box.node.querySelector('.lbPlayerCombo').getAttribute('data-value')
  //     });

  //     // Tween to 0 to remove the transforms
  //     TweenLite.fromTo(box.node, 0.5, { x, y }, { x: lastX, y: lastY, ease });
  //     // TweenLite.fromTo(box.node, 0.5, { x, y }, { x: 0, y: 0, ease });
  //   }

  var targetBox = boxes[newPosition - 1];
  var movingBox = boxes[oldPosition - 1];

  targetBox.node.style.order = oldPosition;
  movingBox.node.style.order = newPosition;

  var lastMovingX = movingBox.x;
  var lastMovingY = movingBox.y;
  var lastTargetX = targetBox.x;
  var lastTargetY = targetBox.y;

  targetBox.x = targetBox.node.offsetLeft;
  targetBox.y = targetBox.node.offsetTop;
  movingBox.x = movingBox.node.offsetLeft;
  movingBox.y = movingBox.node.offsetTop;

  // Reversed delta values taking into account current transforms
  var movingX = movingBox.transform.x + lastMovingX - box.x;
  var movingY = movingBox.transform.y + lastMovingY - box.y;
  var targetX = targetBox.transform.x + lastTargetX - box.x;
  var targetY = targetBox.transform.y + lastTargetY - box.y;

  movingBox.node.innerHTML = generateLeaderboardPlayerInnerHtml({
    name: box.node.querySelector(".lbPlayerName").getAttribute("data-value"),
    position: newPosition,
    score: box.node.querySelector(".lbPlayerScore").getAttribute("data-value"),
    combo: box.node.querySelector(".lbPlayerCombo").getAttribute("data-value"),
  });

  targetBox.node.innerHTML = generateLeaderboardPlayerInnerHtml({
    name: box.node.querySelector(".lbPlayerName").getAttribute("data-value"),
    position: oldPosition,
    score: box.node.querySelector(".lbPlayerScore").getAttribute("data-value"),
    combo: box.node.querySelector(".lbPlayerCombo").getAttribute("data-value"),
  });

  // Tween to 0 to remove the transforms
  TweenLite.fromTo(movingBox.node, 0.5, { x: movingX, y: movingY }, { x: targetX, y: targetY, ease });
  TweenLite.fromTo(targetBox.node, 0.5, { x: targetX, y: targetY }, { x: movingX, y: movingY, ease });
}

// function calculateNewPosition(ourPlayer, previousOurPlayer) {
//   const oldPosition = getPositionOfOurPlayer(previousOurPlayer);
//   const currentPosition = getPositionOfOurPlayer(ourPlayer);
//   const newPosition = currentPosition - (oldPosition - currentPosition);
//   return newPosition;
// }

// function getPositionOfOurPlayer(ourPlayer) {
//   return ourPlayer.position;
// }
