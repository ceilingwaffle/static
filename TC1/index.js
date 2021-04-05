var config = {
  debug: true,
};

var tcIdentity = {
  tcid: null,
  pid: null,
};

let tcSocket = new ReconnectingWebSocket("ws://127.0.0.1:24050/tcws");
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let wrapper = document.getElementById("wrapper");
let ifFcpp = document.getElementsByClassName("ifFcpp")[0];
let progress = document.getElementById("progress");

if (config.debug) {
  console.log = function (...items) {
    var text = items.join(" ");
    var node = document.createElement("p");
    node.textContent = text;
    document.getElementById("base").appendChild(node);
    document.getElementById("base").scrollIntoView();
  };
}

socket.onopen = () => {
  if (tcIdentity.tcid === null) {
    console.log("Successfully Connected)");
  } else {
    console.log("Successfully Re-connected");
  }
};
socket.onclose = (event) => {
  console.log("Socket Closed Connection: ", event);
  //socket.send("Client Closed!");
};
socket.onerror = (error) => console.log("Socket Error: ", error);

tcSocket.onopen = () => {
  if (tcIdentity.tcid === null) {
    console.log("Successfully Connected (tcSocket)");
    tcSocket.send(JSON.stringify({ mid: "connected" }));
  } else {
    console.log("Successfully Re-connected (tcSocket)");
    tcSocket.send(JSON.stringify({ mid: "reconnected", tcid: tcIdentity.tcid, pid: tcIdentity.pid }));
  }
};
tcSocket.onclose = (event) => {
  console.log("Socket Closed Connection (tcSocket): ", event);
  //tcSocket.send("Client Closed! (tcSocket)");
};
tcSocket.onerror = (error) => console.log("Socket Error (tcSocket): ", error);

tcSocket.onmessage = (event) => {
  let data = JSON.parse(event.data);
  console.log("tcSocket data received", data);
  if (data.mid == "tid-assigned") {
    tcIdentity.tcid = data.tcid;
    tcIdentity.pid = data.pid;
    console.log("identity assigned", tcIdentity);
    animation.pp.update(tcIdentity.tcid);

    if (config.debug) {
      let msg = JSON.stringify({ mid: "setup-finished", tcid: tcIdentity.tcid, pid: tcIdentity.pid });
      console.log(msg);
      tcSocket.send(msg);
    }
  }
};

let animation = {
  pp: new CountUp("pp", 0, 0, 0, 0.5, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
  ifFcpp: new CountUp("ifFcpp", 0, 0, 0, 0.5, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
  hun: new CountUp("hun", 0, 0, 0, 0.5, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
  fiv: new CountUp("fiv", 0, 0, 0, 0.5, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
  miss: new CountUp("miss", 0, 0, 0, 0.5, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
};

let tempState;
let seek;
let fullTime;
let onepart;

socket.onmessage = (event) => {
  let data = JSON.parse(event.data);

  // let msg = JSON.stringify({ mid: "pong", tcid: tcIdentity.tcid, pid: tcIdentity.pid });
  // tcSocket.send(msg);

  // if (data.menu.state !== tempState) {
  //   tempState = data.menu.state;
  // }
  animation.pp.update(tcIdentity.tcid);

  // if (data.gameplay.pp.current !== "" && (tempState === 2 || tempState === 7)) {
  //   animation.pp.update(data.gameplay.pp.current);
  // }
  // if (data.menu.pp[100] !== "" && tempState !== 2 && tempState !== 7) {
  //   animation.pp.update(data.menu.pp[100]);
  // }
  // if (data.gameplay.pp.fc !== "" && data.gameplay.pp.fc !== 0) {
  //   animation.ifFcpp.update(data.gameplay.pp.fc);
  // } else {
  //   animation.ifFcpp.update(0);
  // }
  // if (data.gameplay.hits[100] > 0) {
  //   animation.hun.update(data.gameplay.hits[100]);
  // } else {
  //   animation.hun.update(0);
  // }
  // if (data.gameplay.hits[50] > 0) {
  //   animation.fiv.update(data.gameplay.hits[50]);
  // } else {
  //   animation.fiv.update(0);
  // }
  // if (data.gameplay.hits[0] > 0) {
  //   animation.miss.update(data.gameplay.hits[0]);
  // } else {
  //   animation.miss.update(0);
  // }

  // if (data.gameplay.hits[0] > 0 || data.gameplay.hits.sliderBreaks > 0) {
  //   ifFcpp.style.opacity = 1;
  // } else {
  //   ifFcpp.style.opacity = 0;
  // }
  // if (fullTime !== data.menu.bm.time.mp3) {
  //   fullTime = data.menu.bm.time.mp3;
  //   onepart = 178 / fullTime;
  // }
  // if (seek !== data.menu.bm.time.current && fullTime !== undefined && fullTime != 0) {
  //   seek = data.menu.bm.time.current;
  //   progress.style.width = onepart * seek + "px";
  // }
};
