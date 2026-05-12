const sections = document.querySelectorAll(".part");

const nextBtn = document.getElementById("nextSectionBtn");
const prevBtn = document.getElementById("prevSectionBtn");

function updateSectionButtons() {
  let currentIndex = -1;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= 200) {
      currentIndex = index;
    }
  });

  // NEXT
  if (currentIndex + 1 < sections.length) {
    nextBtn.href = `#${sections[currentIndex + 1].id}`;
    nextBtn.style.display = "flex";
  } else {
    nextBtn.style.display = "none";
  }

  // PREVIOUS
  if (currentIndex > 0) {
    prevBtn.href = `#${sections[currentIndex - 1].id}`;
    prevBtn.style.display = "flex";
  } else {
    prevBtn.style.display = "none";
  }
}

window.addEventListener("scroll", updateSectionButtons);

updateSectionButtons();
