document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CARGAR EL CARRITO (El "Almacén" persistente)
    // Intentamos leer la "libreta" (localStorage). Si está vacía, empezamos con []
    let cart = JSON.parse(localStorage.getItem('wufCart')) || [];

    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutSection = document.getElementById('checkout-section');
    const cartSummaryElement = document.getElementById('cart-summary');

    // Ejecutamos la vista apenas carga la página para recuperar lo que había
    updateCartView();

    // 2. AÑADIR AL CARRITO
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            
            const product = {
                id: productCard.dataset.productId,
                name: productCard.dataset.productName,
                price: parseFloat(productCard.dataset.productPrice)
            };
            
            cart.push(product);
            saveCart();
            updateCartView();

            // --- EFECTO VISUAL ---
            const originalText = button.innerHTML;
            button.innerHTML = '¡Añadido! 🐾'; // Mensaje amigable
            button.classList.replace('btn-dark', 'btn-success'); // Cambia a verde éxito
            button.disabled = true; // Evita clics dobles accidentales

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.replace('btn-success', 'btn-dark');
                button.disabled = false;
            }, 1200); // Regresa a la normalidad tras 1.2 segundos
        });
    });

    // 3. FUNCIÓN PARA GUARDAR (La clave del éxito)
    function saveCart() {
        // Convertimos el array a Texto (JSON) porque el localStorage solo guarda texto
        localStorage.setItem('wufCart', JSON.stringify(cart));
    }

    // 4. ACTUALIZAR LA VISTA
    function updateCartView() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }

        const section = document.getElementById('checkout-section');
        const summary = document.getElementById('cart-summary');

        if (!section || !summary) return;

        summary.innerHTML = ''; // Limpiamos

        if (cart.length > 0) {
            section.classList.remove('d-none');
            let total = 0;
            const counts = {};

            // Agrupamos con una validación de seguridad
            cart.forEach(item => {
                const name = item.name || "Producto sin nombre";
                const price = item.price || 0;
                
                if (!counts[name]) {
                    counts[name] = { price: price, qty: 0 };
                }
                counts[name].qty++;
            });

            // Creamos el HTML del resumen
            for (const name in counts) {
                const p = counts[name];
                const subtotal = p.price * p.qty;
                total += subtotal;

                const row = document.createElement('div');
                // Usamos clases de Bootstrap básicas para asegurar que se vea
                row.className = 'd-flex justify-content-between align-items-center p-3 mb-2 bg-white rounded shadow-sm border';
                row.innerHTML = `
                    <div class="text-start">
                        <span class="fw-bold">${p.qty}x ${name}</span>
                    </div>
                    <div class="text-end">
                        <span class="text-success fw-bold">$${subtotal.toFixed(2)}</span>
                        <button class="btn btn-sm btn-link text-danger ms-2" onclick="removeOne('${name}')">Eliminar</button>
                    </div>
                `;
                summary.appendChild(row);
            }

            const totalRow = document.createElement('div');
            totalRow.className = 'mt-4 p-3 bg-light rounded';
            totalRow.innerHTML = `<h3 class="fw-bold mb-0">Total: $${total.toFixed(2)} MXN</h3>`;
            summary.appendChild(totalRow);

        } else {
            section.classList.add('d-none');
        }
        if (cart.length === 1) {
            document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Nueva función para quitar de uno en uno
    window.removeOne = function(productName) {
        const index = cart.findLastIndex(p => p.name === productName);
        if (index !== -1) {
            cart.splice(index, 1);
            saveCart();
            updateCartView();
        }
    };

    // 5. FUNCIÓN PARA ELIMINAR (Para que el usuario pueda arrepentirse)
    window.removeItem = function(index) {
        cart.splice(index, 1); // Quita el elemento del array
        saveCart();            // Guarda la nueva lista
        updateCartView();      // Actualiza la pantalla
    };

    // 6. WHATSAPP (Se mantiene igual, pero usa el cart actualizado)
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            let message = '¡Hola Wuf & Munch! 🐾 Me gustaría pedir estos snacks:\n\n';
            let total = 0;
            const counts = {};

            cart.forEach(item => {
                counts[item.name] = (counts[item.name] || 0) + 1;
            });

            for (const name in counts) {
                message += `* ${counts[name]}x ${name}\n`;
            }

            // Calculamos el total para el mensaje
            cart.forEach(item => total += item.price);
            message += `\n*Total: $${total.toFixed(2)} MXN*`;
            
            window.open(`https://wa.me/523325131513?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
});