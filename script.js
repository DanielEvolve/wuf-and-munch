// Le decimos al navegador: "Espera a que todo el HTML esté cargado antes de ejecutar este código"
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica para el año actual en el footer (la movimos aquí antes) ---
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // --- CÓDIGO DEL CARRITO DE COMPRAS ---

    // 1. Carrito virtual y selección de elementos del DOM
    //    Ahora esta búsqueda se hace DESPUÉS de que el HTML está listo.
    const cart = [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutSection = document.getElementById('checkout-section');
    const cartSummaryElement = document.getElementById('cart-summary');

    // 2. Añadir un "escuchador" de clics a cada botón
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            
            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            const productPrice = parseFloat(productCard.dataset.productPrice);

            const product = {
                id: productId,
                name: productName,
                price: productPrice
            };
            
            cart.push(product);

            // ¡Ahora este console.log debería funcionar!
            console.log('Carrito actualizado:', cart);
            
            updateCartView();
        });
    });

    // 3. Función para actualizar la vista del carrito
// 3. Función para actualizar la vista del carrito
    function updateCartView() {
        // Verificación para evitar errores en otras páginas que no tienen estos elementos
        if (!cartCountElement || !checkoutSection || !cartSummaryElement) {
            return; 
        }

        // Actualiza el contador en la barra de navegación
        cartCountElement.textContent = cart.length;

        // Limpia el resumen anterior para no duplicar productos en la vista
        cartSummaryElement.innerHTML = '';

        // Muestra u oculta la sección de checkout y genera el resumen
        if (cart.length > 0) {
            checkoutSection.classList.remove('d-none'); // Muestra la sección
            
            let totalPrice = 0; // Variable para calcular el precio total
            
            // Crea y añade cada producto del carrito al resumen
            cart.forEach(product => {
                // Creamos un nuevo elemento de párrafo <p> para cada producto
                const productElement = document.createElement('p');
                productElement.className = 'cart-item-summary'; // Le damos una clase por si queremos darle estilo después

                // Le ponemos el texto. Ej: "Gelatina de Pollo - $50.00 MXN"
                productElement.textContent = `${product.name} - $${product.price.toFixed(2)} MXN`;
                
                // Añadimos el nuevo elemento de párrafo al div de resumen del carrito
                cartSummaryElement.appendChild(productElement);
                
                // Sumamos el precio de este producto al total
                totalPrice += product.price;
            });
            
            // Añadimos el precio total al final del resumen
            const totalElement = document.createElement('h5'); // Usamos un <h5> para que resalte
            totalElement.className = 'mt-4'; // Añade un margen superior para separarlo de la lista
            totalElement.textContent = `Total: $${totalPrice.toFixed(2)} MXN`; // Mostramos el total
            cartSummaryElement.appendChild(totalElement);

        } else {
            // Si el carrito está vacío, oculta la sección de checkout
            checkoutSection.classList.add('d-none');
        }
    }
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');

    // Añadimos un "escuchador" de clics al botón
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            // Preparamos el mensaje de texto inicial
            let message = '¡Hola Wuf & Munch! 🐾 Me gustaría cotizar los siguientes productos:\n\n';
            let totalPrice = 0;

            // Recorremos el carrito para añadir cada producto al mensaje
            cart.forEach(product => {
                message += `- ${product.name} ($${product.price.toFixed(2)})\n`; // \n es un salto de línea
                totalPrice += product.price;
            });

            // Añadimos el total al final del mensaje
            message += `\n*Total (aproximado): $${totalPrice.toFixed(2)} MXN*\n\n`;
            message += 'Quedo a la espera de mi cotización. ¡Gracias!';

            // Codificamos el mensaje para que sea seguro de usar en una URL
            const encodedMessage = encodeURIComponent(message);
            
            // Reemplaza este número con el teléfono de Wuf & Munch (con código de país, sin + ni espacios)
            const phoneNumber = '523325131513'; 

            // Creamos la URL final para WhatsApp
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Abrimos WhatsApp en una nueva pestaña del navegador
            window.open(whatsappURL, '_blank');
        });
    }

});