const container = document.querySelector("#tabsContainer");
const tabList = container.querySelector('[role="tablist"]');
const tabUnderline = container.querySelector(".tabUnderline");
const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
const tabPanels = Array.from(container.querySelectorAll('[role="tabpanel"]'));

let focusedTab = 0;

tabList.addEventListener("keydown", handleTabListKeydown);

for (const tab of tabs) {
  tab.addEventListener("click", handleTabClick);
}

function updateTabFocus() {
  // Give each tab an index of -1 so that it cannot be focused by normal means (e.g. with the 'tab' key).
  for (const tab of tabs) {
    tab.setAttribute("tabindex", -1);
  }
  // Give only the currently focused tab an index of 0 so that it can be navigated to with the 'tab' key, and from there its siblings can be focused with the arrow keys.
  tabs[focusedTab].setAttribute("tabindex", 0);
  tabs[focusedTab].focus();
}

function handleTabListKeydown(event) {
  const key = event.key;

  if (key === "ArrowRight" || key === "ArrowLeft") {
    if (key === "ArrowRight") {
      focusedTab++;
      // We have gone past the end, wrap around to the start
      if (focusedTab >= tabs.length) {
        focusedTab = 0;
      }
    } else if (key === "ArrowLeft") {
      focusedTab--;
      // We have gone before the start, wrap around to the end
      if (focusedTab < 0) {
        focusedTab = tabs.length - 1;
      }
    }
    updateTabFocus();
  }
}

function handleTabClick(event) {
  const target = event.target;
  const selectedTabIndex = tabs.indexOf(target);

  // unselect all the tabs, then select the clicked tab
  for (const tab of tabs) {
    tab.setAttribute("aria-selected", false);
  }
  target.setAttribute("aria-selected", true);

  // hide all the tab panels, then show the one that the clicked tab controls
  for (const panel of tabPanels) {
    panel.setAttribute("hidden", true);
  }
  container
    .querySelector(`#${target.getAttribute("aria-controls")}`)
    .removeAttribute("hidden");

  // move the tab underline to beneath the currently selected tab
  tabUnderline.style.transform = `translateX(${selectedTabIndex * 100}%)`;

  focusedTab = selectedTabIndex;
  updateTabFocus();
}
