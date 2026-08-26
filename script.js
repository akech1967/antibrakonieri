const API_URL =
  "https://script.google.com/macros/s/AKfycbzZ_B_-UFAi4emDVsI9_PAnQNsw7LOMv-2RyT3c8HZGqRx20uKUVe4Z-DmANOePwn1-/exec";

const card = document.querySelector("#device-card");
const button = document.querySelector("#demo-button");
const statusKicker = document.querySelector("#status-kicker");
const statusTitle = document.querySelector("#status-title");
const statusDescription = document.querySelector("#status-description");
const signalValue = document.querySelector("#signal-value");
const alertTime = document.querySelector("#alert-time");
const lastCheck = document.querySelector("#last-check");
const connectionLabel = document.querySelector("#connection-label");

let lastEventKey = "";

function formatTime(value) {
  if (!value) return "—";

  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString("ka-GE");
  }

  return value;
}

function showEvent(type, time) {
  const eventType = String(type || "").toLowerCase();
  const displayedTime = formatTime(time);

  alertTime.hidden = false;
  alertTime.textContent = `დაფიქსირების დრო: ${displayedTime}`;
  lastCheck.textContent = displayedTime;

  // წყალში სიგნალი
  if (eventType === "signal") {
    card.dataset.state = "alert";

    statusKicker.textContent =
      "ყურადღება — საჭიროა რეაგირება";

    statusTitle.textContent =
      "აღმოჩენილია სიგნალი";

    statusDescription.textContent =
      "ხელსაწყომ წყალში სიგნალი დააფიქსირა";

    signalValue.textContent =
      "სიგნალი აღმოჩენილია";

    signalValue.style.color = "#ef5b4e";

    return;
  }

  // გატაცების მცდელობა
  if (eventType === "theft") {
    card.dataset.state = "alert";

    statusKicker.textContent =
      "გაფრთხილება — მოწყობილობის დაცვა";

    statusTitle.textContent =
      "დაფიქსირდა გატაცების მცდელობა";

    statusDescription.textContent =
      "სისტემამ სენსორის გადაადგილება ან გატაცების მცდელობა დააფიქსირა";

    signalValue.textContent =
      "გატაცების მცდელობა";

    signalValue.style.color = "#ef5b4e";

    return;
  }

  // DATA მოთხოვნა
  if (eventType === "data") {
    card.dataset.state = "safe";

    statusKicker.textContent =
      "დადასტურების მოთხოვნა მიღებულია";

    statusTitle.textContent =
      "შემოვიდა DATA მოთხოვნა";

    statusDescription.textContent =
      "სისტემამ მიიღო დადასტურების მოთხოვნა";

    signalValue.textContent =
      "DATA მიღებულია";

    signalValue.style.color = "";

    return;
  }

  // როცა ჯერ მონაცემი არ არის
  card.dataset.state = "safe";

  statusKicker.textContent =
    "სისტემა მუშაობს";

  statusTitle.textContent =
    "ველოდებით ახალ მონაცემს";

  statusDescription.textContent =
    "მოწყობილობიდან ახალი მოვლენა ჯერ არ დაფიქსირებულა";

  signalValue.textContent =
    "მოლოდინი";

  signalValue.style.color = "";

  alertTime.hidden = true;
}

async function loadLatestEvent() {
  try {
    const response = await fetch(
      `${API_URL}?action=read&t=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.ok) {
      throw new Error(
        result.error || "API error"
      );
    }

    connectionLabel.textContent = "ონლაინ";

    if (!result.data) {
      lastEventKey = "";
      showEvent("", "");
      return;
    }

    const eventType =
      result.data.event || "";

    const eventTime =
      result.data.time || "";

    const eventKey =
      `${eventType}|${eventTime}`;

    lastEventKey = eventKey;

showEvent(
  eventType,
  eventTime
);

  } catch (error) {
    console.error(
      "მონაცემების მიღების შეცდომა:",
      error
    );

    connectionLabel.textContent =
      "ოფლაინ";
  }
}


// დემო ღილაკი
if (button) {

  let demoIndex = 0;

  const demoEvents = [
    "data",
    "signal",
    "theft"
  ];

  button.textContent =
    "სტატუსების დემო";

  button.addEventListener(
    "click",
    () => {

      const demoType =
        demoEvents[
          demoIndex %
          demoEvents.length
        ];

      demoIndex++;

      showEvent(
        demoType,
        new Date()
      );
    }
  );
}


// პირველად მონაცემის წაკითხვა
loadLatestEvent();


// ყოველ 5 წამში განახლება
setInterval(
  loadLatestEvent,
  5000
);
