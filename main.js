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

  document.querySelectorAll('.item-card').forEach(card => {
    const addItem = card.querySelector('.add-item');
    const input = card.querySelector('.stepper-input');

    if (addItem) {
      addItem.addEventListener('click', () =>{
        const itemName = card.querySelector('.item-name').textContent;
        const itemPrice = parseFloat(card.querySelector('.item-price').textContent.replace('₱',''));
        const quantity = parseInt(input ? input.value : 1) || 1;

        addToCart(itemName,itemPrice,quantity);
      });
    }
  });

  function addToCart(name, price, qty) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.push({ name, price, qty });
    }

    updateUI();
  }

  function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);

    updateUI();
  }
  
  function updateUI() {
    const totalItemCount = cart.reduce((total, item) => total + item.qty, 0);
    const cartCounter = document.getElementById('cart-count');

    if(cartCounter) {
      cartCounter.textContent = `${totalItemCount}`;
    }
    updateReceiptUI();
  }

  function updateReceiptUI() {
    const emptyState = document.getElementById('empty-state');
    const cartList = document.getElementById('cart-list');
    const receiptSummary = document.getElementById('receipt-summary');
    const cartTotal = document.getElementById('cart-total');

    if(cart.length === 0){
      emptyState.style.display = 'block';
      cartList.style.display = 'none';
      receiptSummary.style.display = 'none';
      return;
    }
    emptyState.style.display = 'none';
    cartList.style.display = 'block';
    receiptSummary.style.display = 'block';

    let total = 0;
    cartList.innerHTML = '';

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      itemRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;';

      itemRow.innerHTML = `
      <div class = "item-info">
        <span class="item-name" style="font-weight: bold; display: block;">${item.name}</span>
        <span style="font-size: 0.85em;">${item.qty} × ₱${item.price.toFixed(2)}</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <span>₱${itemTotal.toFixed(2)}</span>
        <button class="delete-btn" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-weight: bold;">✕</button>
      </div>
      `;

      itemRow.querySelector('.delete-btn').addEventListener('click', () => {
        removeFromCart(item.name);
      });
      cartList.appendChild(itemRow);
    });
    cartTotal.textContent = `₱${total.toFixed(2)}`;
  }
});