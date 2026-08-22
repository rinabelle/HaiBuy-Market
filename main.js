document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.stepper').forEach(control => {
    const minusBtn = control.querySelector('.btn-minus');
    const addBtn = control.querySelector('.btn-add');
    const input = control.querySelector('.stepper-input');

    addBtn.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
    });
    minusBtn.addEventListener('click', () => {
      let currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    });
  });
  const toolBarBtn = document.querySelectorAll('.toolbar-btn');
  const itemCard = document.querySelectorAll('.item-card');

  toolBarBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBarBtn.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');

      itemCard.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = '';
        }else{
          card.style.display = 'none';
        }
      });
    });
  });

  let cart = [];

  // Target DOM Elements
  const cartList = document.querySelector('.cart-list');
  const emptyState = document.querySelector('.empty-state');
  const totalValueEl = document.querySelector('.total-row span:last-child');
  const cartCountEl = document.getElementById('cart-count'); // Targets <span id="cart-count">

  // Add click handlers to all "ADD" buttons on product cards
  document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.item-card');
      
      // Extract data from card
      const name = card.querySelector('.item-name').textContent.trim();
      const priceText = card.querySelector('.item-price').textContent.trim();
      const price = parseFloat(priceText.replace('₱', ''));
      const quantityInput = card.querySelector('.stepper-input');
      const qtyToAdd = parseInt(quantityInput.value);

      // Check if item already exists in cart array
      const existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        cart.push({
          name: name,
          price: price,
          quantity: qtyToAdd
        });
      }

      // Reset card stepper input back to 1
      quantityInput.value = 1;

      // Update receipt UI and cart count
      updateReceipt();
    });
  });

  // Function to render the receipt ticket and calculate totals
  function updateReceipt() {
    // Clear old list items
    cartList.innerHTML = '';

    // If cart is empty
    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (totalValueEl) totalValueEl.textContent = '₱0.00';
      if (cartCountEl) cartCountEl.textContent = '0';
      return;
    }

    // Hide empty placeholder
    if (emptyState) emptyState.style.display = 'none';

    let totalAmount = 0;
    let totalItemsCount = 0;

    // Loop through items in cart
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      totalItemsCount += item.quantity;

      // Build receipt item row element
      const itemBlock = document.createElement('div');
      itemBlock.classList.add('receipt-item-block');
      itemBlock.innerHTML = `
        <div class="item-line-top">
          <span>${item.name}</span>
          <span>₱${itemTotal.toFixed(2)}</span>
        </div>
        <div class="item-line-bottom">
          <div class="mini-stepper">
            <button class="mini-btn btn-receipt-minus" data-index="${index}">-</button>
            <span class="mini-qty">${item.quantity}</span>
            <button class="mini-btn btn-receipt-add" data-index="${index}">+</button>
          </div>
          <div class="item-unit-details">
            <span>₱${item.price.toFixed(2)} ea</span>
            <button class="btn-remove" data-index="${index}">×</button>
          </div>
        </div>
      `;

      cartList.appendChild(itemBlock);
    });

    // Update receipt total price and cart count header
    if (totalValueEl) totalValueEl.textContent = `₱${totalAmount.toFixed(2)}`;
    if (cartCountEl) cartCountEl.textContent = totalItemsCount;

    // Attach listeners for interactive receipt buttons (+, -, remove)
    attachReceiptEventListeners();
  }

  // Handle receipt item quantity changes & removals
  function attachReceiptEventListeners() {
    document.querySelectorAll('.btn-receipt-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        cart[index].quantity += 1;
        updateReceipt();
      });
    });

    document.querySelectorAll('.btn-receipt-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        updateReceipt();
      });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        cart.splice(index, 1);
        updateReceipt();
      });
    });
  }
});