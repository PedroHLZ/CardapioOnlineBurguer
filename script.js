const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add("flex", "justify-between", "flex-col");

        cartItemElement.innerHTML = `
         <hr>
                    <div class="flex items-center justify-between mb-4 mt-4">
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="font-bold">Qtd: ${item.quantity}</p>
                            <p class="font-bold mt-2">Preço: R$ ${item.price}</p>
                        </div>
                        <button class="px-4 py-1 rounded-md hover:scale-110 duration-300 remove-from-cart-btn" data-name="${item.name}">
                            <i class="fas fa-trash-alt" style="color: #ff0000;"></i>
                        </button>
                    </div>
                <hr>
                `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.closest(".remove-from-cart-btn")) {
        const name = event.target.closest(".remove-from-cart-btn").getAttribute("data-name");

        removeItemFromCart(name);
    }
});

function removeItemFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}


addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//finaliza pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestauranteOpen()
    if (!isOpen) {

        Toastify({
            text: "Ops!!! Estamos fechado no mometo!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },

        }).showToast();


        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
// Calcular o total do carrinho
let totalCartValue = 0;
cart.forEach(item => {
    totalCartValue += item.quantity * item.price;
});

// Formatar os itens do carrinho para o WhatsApp
const cartItemsText = cart.map((item, index) => {
    const itemTotal = (item.quantity * item.price).toFixed(2); // Total do item
    return `${index + 1}. ${item.name}
 | Qtd: ${item.quantity}
 | Valor: R$ ${itemTotal}`;
}).join("%0A%0A"); // %0A é o código para quebra de linha na URL

// Adicionar o total do carrinho à mensagem
const totalText = ` | Total do Pedido: R$ ${totalCartValue.toFixed(2)}`;

// Incluir o endereço de entrega na mensagem
const addressText = ` | Endereço de Entrega: ${encodeURIComponent(addressInput.value)}`;

// Montar a URL para enviar via WhatsApp
const phone = "5581985090240";
const whatsappUrl = `https://wa.me/${phone}?text=${cartItemsText}%0A%0A${addressText}%0A%0A${totalText}`;

// Abrir o link para enviar a mensagem no WhatsApp
window.open(whatsappUrl, "_blank");

// Limpar o carrinho e atualizar o modal
cart = [];
updateCartModal();

})

//verifica a hora e manipula o card horario
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;

}

const spanItem = document.getElementById("date-span")

const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")

} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
    checkoutBtn.classList.add("bg-gray-500")

}