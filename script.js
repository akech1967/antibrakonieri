const card = document.querySelector("#device-card");
const button = document.querySelector("#demo-button");
const statusKicker = document.querySelector("#status-kicker");
const statusTitle = document.querySelector("#status-title");
const statusDescription = document.querySelector("#status-description");
const signalValue = document.querySelector("#signal-value");
const alertTime = document.querySelector("#alert-time");
const lastCheck = document.querySelector("#last-check");

function setAlert(active, timestamp = new Date()) {
  card.dataset.state = active ? "alert" : "safe";
  statusKicker.textContent = active ? "ყურადღება — საჭიროა რეაგირება" : "სისტემა მუშაობს გამართულად";
  statusTitle.textContent = active ? "დაფიქსირდა განგაშის სიგნალი!" : "საფრთხე არ დაფიქსირებულა";
  statusDescription.textContent = active
    ? "ხელსაწყო #1-მა წყალში საეჭვო ელექტრული სიგნალი აღმოაჩინა"
    : "ხელსაწყო აკვირდება წყლის სიგნალს რეალურ დროში";
  signalValue.textContent = active ? "განგაში" : "ნორმალური";
  signalValue.style.color = active ? "#ef5b4e" : "";
  alertTime.hidden = !active;
  alertTime.textContent = active
    ? `დაფიქსირების დრო: ${timestamp.toLocaleString("ka-GE")}`
    : "—";
  button.textContent = active ? "ნორმალურ რეჟიმზე დაბრუნება" : "განგაშის დემო";
}

button.addEventListener("click", () => setAlert(card.dataset.state !== "alert"));

setInterval(() => {
  lastCheck.textContent = "ახლახან";
}, 30000);

// Google Sheet-ის ინტეგრაციისას აქედან გამოიძახეთ:
// setAlert(true, new Date(sheetTimestamp));
window.AntiPoacher = { setAlert };
