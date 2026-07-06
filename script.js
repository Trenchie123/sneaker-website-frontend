let currentProduct = "jordan";
let selectedColorName = "";
let selectedSizeValue = "8";
let userShoppingBagArray = [];
let priceTracker = { val: 0 }; // GSAP Odometer state counter storage

// Centralized Product Matrix with Hex Colors for Idea 4 backdrop matching
const productData = {
  jordan: {
    title: "Air Jordan 1 High Top",
    tag: "Premium Retro Edition",
    price: "Ksh 24,500",
    defaultImg: "air-jordan-1black.png",
    colors: [
      { name: "Black", file: "air-jordan-1black.png", class: "black", hex: "#e5e5e5" },
      { name: "Red", file: "air-jordan-1red.png", class: "red", hex: "#ffccd5" },
      { name: "Beige", file: "air-jordan-1beige.png", class: "beige", hex: "#fefae0" }
    ]
  },
  af1: {
    title: "Air Force 1 Low",
    tag: "Classic Streetwear Edition",
    price: "Ksh 15,200",
    defaultImg: "air-force-1white.png",
    colors: [
      { name: "White", file: "air-force-1white.png", class: "white", hex: "#ffffff" },
      { name: "White/Black", file: "air-force-1white-black.png", class: "white-black", hex: "#d3d3d3" },
      { name: "White/Black/Blue", file: "air-force-1white-black-blue.png", class: "white-black-blue", hex: "#caf0f8" },
      { name: "Black", file: "air-force-1black.png", class: "black", hex: "#4a4a4a" },
      { name: "Brown", file: "air-force-1brown.png", class: "brown", hex: "#ddb892" }
    ]
  },
  jordan4: {
    title: "Air Jordan 4",
    tag: "Retro Flight Edition",
    price: "Ksh 26,800",
    defaultImg: "air-jordan-4white-and maroon.png",
    colors: [
      { name: "White and Maroon", file: "air-jordan-4white-and maroon.png", class: "white-maroon", hex: "#fcd5ce" },
      { name: "Black and Red", file: "air-jordan-4black-and-red.png", class: "black-red", hex: "#ffb5a7" },
      { name: "Black Pink", file: "air-jordan-4black-pink.png", class: "black-pink", hex: "#ffcad4" }
    ]
  },
  airmax: {
    title: "Air Max 97 Ultra",
    tag: "Max Cushioning Line",
    price: "Ksh 19,800",
    defaultImg: "air-max-white.png",
    colors: [
      { name: "White", file: "air-max-white.png", class: "white", hex: "#e6e9f0" },
      { name: "Black Blue", file: "air-max-black-blue.png", class: "black-blue", hex: "#1d3557" },
      { name: "Black Pink", file: "air-max-black-pink.png", class: "black-pink", hex: "#4a154b" },
      { name: "Black White", file: "air-max-black-white.png", class: "black-white", hex: "#2b2d42" }
    ]
  }
};

// Idea 1: Clean Native Dark Mode Variable Switching State
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  gsap.fromTo(themeToggleBtn, { rotation: 0 }, { rotation: 360, duration: 0.5, ease: "power2.out" });
});

// Idea 3: Physics Component — Card Tilt Tracking Module
document.querySelectorAll(".tilt-target").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    gsap.to(card, {
      rotateY: x * 0.12,
      rotateX: -y * 0.12,
      transformPerspective: 600,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
  });
});

// Idea 3: Physics Component — Magnetic Action Button Gravity Link
document.querySelectorAll(".magnetic-target").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  });
});

// Configurator Initialization & Open Sequence
function openConfiguratorModal(productId = 'jordan') {
  currentProduct = productId;
  const product = productData[productId];
  
  document.getElementById("modalTitle").innerText = product.title;
  document.getElementById("modalTag").innerText = product.tag;
  document.getElementById("modalPrice").innerText = product.price;
  document.getElementById("modalShoeImage").src = product.defaultImg;
  
  // Dynamic color wheel builder node insertion
  const colorPickerContainer = document.getElementById("modalColorPicker");
  colorPickerContainer.innerHTML = "";
  
  product.colors.forEach((color, index) => {
    const circle = document.createElement("div");
    circle.className = `color-circle ${color.class} ${index === 0 ? 'active' : ''}`;
    circle.title = color.name;
    circle.setAttribute("onclick", `changeColor('${color.name}', '${color.file}', this)`);
    colorPickerContainer.appendChild(circle);
  });

  selectedColorName = product.colors[0].name;
  document.getElementById("shoeQty").value = "1";
  
  // Set default starting theme color circle backdrop instantly
  gsap.set(".modal-circle-backdrop", { backgroundColor: product.colors[0].hex });

  document.getElementById("configuratorModal").classList.add("open");
  gsap.fromTo(".config-modal-window", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" });
}

function closeConfiguratorModal(event) {
  if (event) event.stopPropagation();
  document.getElementById("configuratorModal").classList.remove("open");
}

// Idea 4: Interactive Color Backdrop Morphing Timeline Implementation
function changeColor(colorName, imagePath, element) {
  const modalShoeImage = document.getElementById("modalShoeImage");
  const backdropCircle = document.querySelector(".modal-circle-backdrop");
  
  document.querySelectorAll(".color-circle").forEach(circle => circle.classList.remove("active"));
  element.classList.add("active");
  
  selectedColorName = colorName;
  const variant = productData[currentProduct].colors.find(c => c.name === colorName);

  const tl = gsap.timeline();
  tl.to(modalShoeImage, { scale: 0.1, rotation: -40, opacity: 0, duration: 0.25, ease: "power2.in" })
    .to(backdropCircle, { backgroundColor: variant.hex, scale: 1.1, duration: 0.35, ease: "power2.out" }, "-=0.1")
    .call(() => { modalShoeImage.src = imagePath; })
    .to(modalShoeImage, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(1.2)" })
    .to(backdropCircle, { scale: 1, duration: 0.2 });
}

function selectSize(element) {
  document.querySelectorAll(".size-box").forEach(box => box.classList.remove("active"));
  element.classList.add("active");
  selectedSizeValue = element.innerText;
}

function changeQty(amount) {
  const qtyField = document.getElementById("shoeQty");
  let currentVal = parseInt(qtyField.value) + amount;
  if (currentVal >= 1) qtyField.value = currentVal;
}

// State Insertion Pipeline to Shopping Cart Model
function triggerCartSuccess() {
  const qty = parseInt(document.getElementById("shoeQty").value);
  const toast = document.getElementById("notificationToast");
  const msgField = document.getElementById("toastMessage");
  const selectedProduct = productData[currentProduct];
  
  userShoppingBagArray.push({
    title: selectedProduct.title,
    price: selectedProduct.price,
    color: selectedColorName,
    size: selectedSizeValue,
    quantity: qty,
    img: selectedProduct.colors.find(c => c.name === selectedColorName).file
  });

  refreshLiveCartDisplay();

  msgField.innerText = `Added ${qty}x ${selectedProduct.title} to your bag!`;
  closeConfiguratorModal();
  
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 3200);
}

// Idea 2: Live Cart Renderer Engine & GSAP Subtotal Odometer
function refreshLiveCartDisplay() {
  const emptyState = document.getElementById("cartEmptyState");
  const container = document.getElementById("cartItemsContainer");
  const checkoutBar = document.getElementById("cartCheckoutBar");
  const totalPriceLabel = document.getElementById("cartTotalPriceLabel");
  
  if (userShoppingBagArray.length === 0) {
    emptyState.style.display = "block";
    container.innerHTML = "";
    checkoutBar.style.display = "none";
    priceTracker.val = 0;
    totalPriceLabel.innerText = "Ksh 0";
    return;
  }
  
  emptyState.style.display = "none";
  checkoutBar.style.display = "block";
  container.innerHTML = "";
  
  let totalSum = 0;
  
  userShoppingBagArray.forEach((item, index) => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
    totalSum += (numericPrice * item.quantity);

    const itemCard = document.createElement("div");
    itemCard.className = "cart-item-row";
    itemCard.innerHTML = `
      <div class="cart-item-left">
        <img src="${item.img}" alt="Thumb" class="cart-thumb">
        <div>
          <h4>${item.title}</h4>
          <p>Color: ${item.color} | Size: US ${item.size}</p>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-qty">Qty: ${item.quantity}</span>
        <span class="cart-row-price">${item.price}</span>
        <button class="cart-remove-btn" onclick="removeCartItem(${index})">&times;</button>
      </div>
    `;
    container.appendChild(itemCard);
  });

  // GSAP numeric value tracking animation engine
  gsap.to(priceTracker, {
    val: totalSum,
    duration: 0.7,
    ease: "power2.out",
    onUpdate: () => {
      totalPriceLabel.innerText = `Ksh ${Math.floor(priceTracker.val).toLocaleString()}`;
    }
  });
}

function removeCartItem(index) {
  userShoppingBagArray.splice(index, 1);
  refreshLiveCartDisplay();
}

// Idea 2 Checkout Trigger — Fire Canvas Confetti Multi-burst explosions
function handleCheckoutSimulation() {
  confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
  setTimeout(() => {
    alert("Order Received Successfully! Simulation complete.");
    userShoppingBagArray = [];
    refreshLiveCartDisplay();
  }, 600);
}