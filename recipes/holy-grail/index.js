const showHideButton = document.getElementById("showHideButton");
const hiddenContent = document.getElementById("hiddenContent");

showHideButton.addEventListener("click", function () {
  if (hiddenContent.hidden) {
    hiddenContent.hidden = false;
    this.innerText = "Show less content";
  } else {
    hiddenContent.hidden = true;
    this.innerText = "Show more content";
  }
});
