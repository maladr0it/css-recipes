const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"])',
];

function Modal(container) {
  const closeButtons = container.querySelectorAll("[data-close-button]");
  const backdrop = container.querySelector(".backdrop");
  let scrollTop = 0;
  let activeElement = null;
  let onHide = () => {};

  function addListeners() {
    document.addEventListener("keydown", handleKeyDown);
    backdrop.addEventListener("click", handleBackdropClick);
    for (button of closeButtons) {
      button.addEventListener("click", hide);
    }
  }

  function removeListeners() {
    document.removeEventListener("keydown", handleKeyDown);
    backdrop.removeEventListener("click", handleBackdropClick);
    for (button of closeButtons) {
      button.removeEventListener("click", hide);
    }
  }

  function getFocusableNodes() {
    const nodes = container.querySelectorAll(FOCUSABLE_ELEMENTS);
    return Array.from(nodes);
  }

  function handleBackdropClick(event) {
    // only hide if the backdrop itself was clicked, not its descendents
    if (event.currentTarget === event.target) {
      hide();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Tab") {
      trapFocus(event);
    } else if (event.key === "Escape") {
      hide();
    }
  }

  function setInitialFocus() {
    const focusableNodes = getFocusableNodes();
    // nothing to focus
    if (focusableNodes.length === 0) {
      return;
    }
    const nodesExcludingCloseButton = focusableNodes.filter(
      node => !node.hasAttribute("data-close-button")
    );
    // ideally, we focus something that won't close the modal even if it is the first item
    if (nodesExcludingCloseButton.length > 0) {
      nodesExcludingCloseButton[0].focus();
    } else {
      // if there is nothing else to focus, focus the first focusable item
      focusableNodes[0].focus();
    }
  }

  function trapFocus(event) {
    const focusableNodes = getFocusableNodes();
    // nothing to focus
    if (focusableNodes.length === 0) {
      return;
    }
    // if nothing in the modal is focused
    if (!container.contains(document.activeElement)) {
      event.preventDefault();
      focusableNodes[0].focus();
      return;
    }
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    if (event.shiftKey && focusedItemIndex === 0) {
      // if we are cycling focus backward and are currently focusing the first item
      event.preventDefault();
      focusableNodes[focusableNodes.length - 1].focus();
    } else if (
      !event.shiftKey &&
      focusedItemIndex === focusableNodes.length - 1
    ) {
      // if we are cycling focus forward and are currently focusing the last item
      event.preventDefault();
      focusableNodes[0].focus();
    }
  }

  function show() {
    // store the currently focused element before the modal opens
    activeElement = document.activeElement;
    // save the scroll position for it to be restored later
    scrollTop = document.documentElement.scrollTop;

    container.classList.remove("hidden");
    // when <body> becomes fixed, the scrollbar will be removed, moving the page content slightly to the left
    // offset <body>'s content by that width with a margin to prevent this
    scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.marginRight = `${scrollbarWidth}px`;
    document.body.classList.add("fixed");
    document.body.style.top = `-${scrollTop}px`;

    setInitialFocus();
    addListeners();
  }

  function hide() {
    onHide();
    removeListeners();

    container.classList.add("hidden");
    document.body.style.marginRight = "0";
    document.body.classList.remove("fixed");
    document.body.style.top = "";

    document.documentElement.scrollTop = scrollTop;
    if (activeElement) {
      activeElement.focus();
    }
  }

  function setOnHide(fn) {
    onHide = fn;
  }

  return { show, hide, setOnHide };
}

// set up modal on the page
const Modal1 = Modal(document.getElementById("modal-1-container"));
for (const button of document.querySelectorAll(".show-modal-button")) {
  button.addEventListener("click", Modal1.show);
}

// set up form
const form1 = document.getElementById("form-1");

form1.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form1);
  for (const [field, value] of formData) {
    console.log(`${field}: ${value}`);
  }
  form1.reset();
  Modal1.hide();
});

Modal1.setOnHide(() => {
  form1.reset();
});
