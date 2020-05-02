const stickyHeader = document.getElementById("sticky-header");
const stickySentinel = document.getElementById("sticky-sentinel");

const stickyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      stickyHeader.classList.remove("header--sticky");
    } else {
      stickyHeader.classList.add("header--sticky");
    }
  });
});

stickyObserver.observe(stickySentinel);
