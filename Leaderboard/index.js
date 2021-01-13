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

  let leaderboxPlayerNodes = leaderboardBox.querySelectorAll(".lbPlayer");

  if (!leaderboxPlayerNodes.length) {
    // render initial leaderboard
    currentPlayerSlots.forEach((playerSlot) => {
      let playerNode = document.createElement("div");
      playerNode.innerHTML = generateLeaderboardPlayerInnerHtml(playerSlot);
      playerNode.classList.add("lbPlayer");
      leaderboardBox.appendChild(playerNode);
    });
  } else {
    const newPosition = ourPlayer.position;
    const oldPosition = previousOurPlayer?.position || newPosition;
    const playerNode = leaderboardBox.childNodes[oldPosition - 1];

    // update ourPlayer values
    playerNode.innerHTML = generateLeaderboardPlayerInnerHtml(ourPlayer);
    console.log("newPosition", newPosition);
    console.log("oldPosition", oldPosition);

    // update existing leaderboard
    if (newPosition !== oldPosition) {
      // const targetNode = leaderboardBox.childNodes[newPosition - 1];
      movePlayerDiv(playerNode, newPosition, oldPosition);
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

function movePlayerDiv(playerNode, targetPosition, oldPosition) {
  nodeInTargetPosition = playerNode.parent.childNodes[targetPosition - 1];
  nodeInOldPosition = playerNode.parent.childNodes[oldPosition - 1];
  nodeInTargetPosition.before(playerNode);
  nodeInOldPosition.remove();
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
