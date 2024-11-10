const topBar = document.getElementById("top-bar");
const exteriorButtons = document.getElementById("exterior-buttons");
const interiorButtons = document.getElementById("interior-buttons");
const exteriorImage = document.getElementById("exterior-image");
const interiorImage = document.getElementById("interior-image");
const wheelButtons = document.getElementById("wheel-buttons");
const performanceBtn = document.getElementById("performance-btn");
const totalPriceEl = document.getElementById("total-price");
const fullSelfDrivingCheckbox = document.getElementById(
  "full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);

const downPaymentEl = document.getElementById("down-payment");
const monthlyPaymentEl = document.getElementById("monthly-payment");

const BASE_PRICE = 52_490;
let currentPrice = BASE_PRICE;

let selectedColor = "Stealth Grey";

const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};

const pricing = {
  "Performance Wheels": 2_500,
  "Performance Package": 5_000,
  "Full Self-Driving": 8_500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Leather": 225,
  },
};

// Update Total Price in the UI
const updateTotalPrice = () => {
  // Reset the current price to the base price
  currentPrice = BASE_PRICE;

  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }

  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }

  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price in the UI
  totalPriceEl.textContent = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakdown();
};

// Update Payment Breakdown Based on Current Price
const updatePaymentBreakdown = () => {
  const downPayment = currentPrice * 0.1;
  downPaymentEl.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate Loan Detailas (assuming 60-month loan at 3% interest rate)
  const loanTermMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly Payment Formula: P * (r(1 + r)^n) / ((1 + r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymentEl.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

// Handle Top Bar On Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// Image Mapping
const exteriorImages = {
  "Stealth Grey": "images/model-y-stealth-grey.jpg",
  "Pearl White": "images/model-y-pearl-white.jpg",
  "Deep Blue": "images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "images/model-y-solid-black.jpg",
  "Ultra Red": "images/model-y-ultra-red.jpg",
  Quicksilver: "images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "images/model-y-interior-dark.jpg",
  Light: "images/model-y-interior-light.jpg",
};

// Handle Color Selection
const handleColorButtonClick = (event) => {
  let button;

  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (!button) return;

  const buttons = event.currentTarget.querySelectorAll("button");

  buttons.forEach((btn) => btn.classList.remove("btn-selected"));

  button.classList.add("btn-selected");

  // Change Exterior Image
  if (event.currentTarget === exteriorButtons) {
    selectedColor = button.querySelector("img").alt;
    updateExteriorImage();
  }

  // Change Interior Image
  if (event.currentTarget === interiorButtons) {
    const color = button.querySelector("img").alt;
    interiorImage.src = interiorImages[color];
  }
};

// Update Exterior Image Based On Color and Wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";

  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";

  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

// Handle Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName !== "BUTTON") return;

  const buttons = event.currentTarget.querySelectorAll("button");
  buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

  // Add Selected Styles To Clicked Button
  event.target.classList.add("bg-gray-700", "text-white");

  selectedOptions["Performance Wheels"] =
    event.target.textContent.includes("Performance");

  updateExteriorImage();
  updateTotalPrice();
};

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  // Update selected options
  selectedOptions["Performance Package"] = isSelected;

  updateTotalPrice();
};

// Full Self Driving Selection
const fullSelfDrivingChange = () => {
  selectedOptions["Full Self-Driving"] = fullSelfDrivingCheckbox.checked;

  updateTotalPrice();
};

// Handle Accessory Checkbox Listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => void updateTotalPrice());
});

// Event Listeners
window.addEventListener("scroll", () => {
  requestAnimationFrame(handleScroll);
});

// Initial Update Price
document.addEventListener("DOMContentLoaded", () => {
  updateTotalPrice();
});

exteriorButtons.addEventListener("click", handleColorButtonClick);
interiorButtons.addEventListener("click", handleColorButtonClick);
wheelButtons.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
