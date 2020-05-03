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
  const closeButton = container.querySelector(".close-button");
  const backdrop = container.querySelector(".backdrop");
  let scrollTop = 0;
  let activeElement = null;

  function addListeners() {
    closeButton.addEventListener("click", hide);
    backdrop.addEventListener("click", handleBackdropClick);
  }

  function removeListeners() {
    closeButton.removeEventListener("click", hide);
    backdrop.removeEventListener("click", handleBackdropClick);
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

  function show() {
    addListeners();
    container.classList.remove("hidden");
    document.body.classList.add("fixed");
    // store the currently focused element before the modal opens
    activeElement = document.activeElement;
  }

  function hide() {
    container.classList.add("hidden");
    document.body.classList.remove("fixed");

    removeListeners();
    if (activeElement) {
      activeElement.focus();
    }
  }

  return { show };
}

const modalContainer = document.getElementById("modal-container");
const showModalButtons = document.querySelectorAll(".show-modal-button");

const MyModal = Modal(modalContainer);

for (const button of showModalButtons) {
  button.addEventListener("click", MyModal.show);
}
