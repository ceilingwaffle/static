const settings = {
  leaderboardSlotsShown: 6,
};

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

// let animation = {
//   acc: new CountUp("accdata", 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
//   combo: new CountUp("combodata", 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
// };

let lbState;
let lbStateBefore;
// let ourPlayer;
// let ourPlayerBefore;

socket.onmessage = (event) => {
  let data = JSON.parse(event.data);
  let isVisible = data.gameplay.leaderboard.isVisible;
  let gameState = data.menu.state;
  let isPlaying = gameState == 2;

  // ourPlayerBefore = ourPlayer;
  // lbStateBefore = lbState;
  ourPlayer = data.gameplay.leaderboard.ourplayer;
  lbState = data.gameplay.leaderboard.slots;

  if ((lbState && !lbState.length) || !ourPlayer) {
    return;
  };

  if (!data.gameplay.leaderboard.hasLeaderboard) {
    leaderboardBox.innerHTML = "";
    return;
  }
  console.log('a', isVisible, isPlaying);


  let mapStarting = false;

  // set the ourPlayer position to the last position (is initially 0 at the beginning of the map for some reason)
  if (ourPlayer.position < 1) {
    ourPlayer.position = lbState.length;
    mapStarting = true;
    isVisible = true;
    isPlaying = true;
  }

  console.log('b', isVisible, isPlaying, mapStarting);
  handleLeaderboardVisibility(isVisible, isPlaying);

  let leaderboxPlayerNodes = leaderboardBox.querySelectorAll(".lbPlayer");

  leaderboardBox.innerHTML = "";

  lbState.forEach((lbSlot) => {
    let newNode = createLeaderboardNode(lbSlot, ourPlayer);
    leaderboardBox.appendChild(newNode);
  });
  
  if (mapStarting) {
    let newNode = createLeaderboardNode(ourPlayer, ourPlayer);
    leaderboardBox.appendChild(newNode);
  }

  if (!leaderboxPlayerNodes.length) {
    // render initial leaderboard
  } else {
    // update existing leaderboard
  }
};

function createLeaderboardNode(lbSlot, ourPlayer) {
  const newNode = document.createElement("div");
  newNode.innerHTML = generateLeaderboardPlayerInnerHtml(lbSlot);
  newNode.classList.add("lbPlayer");
  if (lbSlot.position == ourPlayer.position) {
    newNode.classList.add("ourPlayer");
  }

  const x = settings.leaderboardSlotsShown;
  if (lbSlot.position == 1) {
    newNode.classList.add("shown");
  } else if (ourPlayer.position.between(1, x) && lbSlot.position.between(1, x)) {
    newNode.classList.add("shown");
  } else if (lbSlot.position.between(ourPlayer.position - x + 2, ourPlayer.position)) {
    newNode.classList.add("shown");
  } else {
    newNode.classList.add("notShown");
  }
  return newNode;
}

function generateLeaderboardPlayerInnerHtml(playerSlot) {
  return `
    <div class="lbPlayerName" data-value="${playerSlot.name}">${playerSlot.name}</div>
    <div class="lbPlayerPosition" data-value="${playerSlot.position}">${playerSlot.position}</div>
    <div class="lbPlayerScore" data-value="${playerSlot.score}">${playerSlot.score.toLocaleString('en', {useGrouping:true})}</div>
    <div class="lbPlayerCombo" data-value="${playerSlot.maxCombo}">${playerSlot.maxCombo}x</div>`;
}

function handleLeaderboardVisibility(isVisible, isPlaying) {
  if (!isPlaying) {
    leaderboardBox.style.opacity = 0;
    return;
  }
  
  if (!isVisible) {
    leaderboardBox.style.opacity = 1;
  } else {
    leaderboardBox.style.opacity = 0;
  }
}

Number.prototype.between = function (a, b, inclusive = true) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};
