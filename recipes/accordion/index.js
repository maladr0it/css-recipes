const accordion = document.getElementById("accordion");

function handleTriggerClick(event) {
  console.log(event.target);
}

accordion.addEventListener("click", handleTriggerClick);
