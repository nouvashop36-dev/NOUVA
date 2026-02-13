document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const logoContainer = document.getElementById('logo-container');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginModal = document.getElementById('close-admin-login-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const viewProductsBtn = document.getElementById('view-products-btn');
    const productsSection = document.getElementById('products-section');
    const productGrid = document.getElementById('product-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const orderNowBtn = document.getElementById('order-now-btn');
    const cancelOrderBtn = document.getElementById('cancel-order-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModal = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const currencySwitcher = document.getElementById('currency-switcher');
    const langSwitcher = document.getElementById('lang-switcher');
    const productModal = document.getElementById('product-modal');
    const productModalContent = document.getElementById('product-modal-content');

    // --- STATE MANAGEMENT ---
    let logoClickCount = 0;
    let cart = JSON.parse(localStorage.getItem('nouvaShopCart')) || {};
    let currentCurrency = 'MAD';
    let currentLang = 'ar';
    let exchangeRate = null; // To be fetched

    // --- MOCK DATA ---
    const products = [
        { id: 1, name: {ar: "كأس شاي مغربي", en: "Moroccan Tea Glass"}, price: 50, oldPrice: 70, img: "https://i.postimg.cc/pX3RjVSH/image.png", desc: {ar: "كأس شاي مغربي أصيل مزخرف يدوياً.", en: "Authentic hand-decorated Moroccan tea glass."} },
        { id: 2, name: {ar: "فنجان قهوة ذهبي", en: "Golden Coffee Cup"}, price: 80, oldPrice: 110, img: "https://i.postimg.cc/L8YgQZbf/image.png", desc: {ar: "فنجان قهوة فاخر بلمسة ذهبية.", en: "Luxury coffee cup with a golden touch."} },
        { id: 3, name: {ar: "كأس عصير كريستال", en: "Crystal Juice Glass"}, price: 65, oldPrice: 90, img: "https://i.postimg.cc/J0fGfVwW/image.png", desc: {ar: "كأس عصير من الكريستال النقي لتجربة منعشة.", en: "Pure crystal juice glass for a refreshing experience."} },
        { id: 4, name: {ar: "إبريق شاي فخاري", en: "Ceramic Teapot"}, price: 250, oldPrice: 320, img: "https://i.postimg.cc/W4z1GZgV/image.png", desc: {ar: "إبريق شاي فخاري يحافظ على حرارة الشاي.", en: "Ceramic teapot that maintains tea temperature."} },
        // Add 16 more products here...
        { id: 5, name: {ar: "طقم فناجين", en: "Cup Set"}, price: 300, oldPrice: 400, img: "https://i.postimg.cc/k5jTzWjJ/image.png", desc: {ar: "طقم فناجين قهوة لستة أشخاص.", en: "Coffee cup set for six people."} },
        { id: 6, name: {ar: "كأس ماء مزخرف", en: "Decorated Water Glass"}, price: 45, oldPrice: 60, img: "https://i.postimg.cc/YqCg2zGr/image.png", desc: {ar: "كأس ماء بتصميم فريد.", en: "Water glass with a unique design."} },
        { id: 7, name: {ar: "إبريق حليب", en: "Milk Jug"}, price: 120, oldPrice: 150, img: "https://i.postimg.cc/L6RkYj2J/image.png", desc: {ar: "إبريق لتقديم الحليب بأناقة.", en: "An elegant jug for serving milk."} },
        { id: 8, name: {ar: "صحن تقديم", en: "Serving Plate"}, price: 180, oldPrice: 220, img: "https://i.postimg.cc/WbXyFpG0/image.png", desc: {ar: "صحن تقديم فاخر للحلويات.", en: "A luxurious plate for serving desserts."} },
        { id: 9, name: {ar: "كأس عصائر طويل", en: "Highball Glass"}, price: 70, oldPrice: 95, img: "https://i.postimg.cc/43sYcZzV/image.png", desc: {ar: "كأس طويل للعصائر والكوكتيلات.", en: "A tall glass for juices and cocktails."} },
        { id: 10, name: {ar: "إبريق قهوة تركي", en: "Turkish Coffee Pot"}, price: 150, oldPrice: 190, img: "https://i.postimg.cc/J7wzY2fK/image.png", desc: {ar: "إبريق نحاسي لصنع القهوة التركية.", en: "A copper pot for making Turkish coffee."} },
        { id: 11, name: {ar: "كأس شاي زجاجي", en: "Glass Tea Cup"}, price: 40, oldPrice: 55, img: "https://i.postimg.cc/d143sJbC/image.png", desc: {ar: "كأس شاي زجاجي شفاف وأنيق.", en: "A clear and elegant glass tea cup."} },
        { id: 12, name: {ar: "وعاء سكر", en: "Sugar Bowl"}, price: 90, oldPrice: 120, img: "https://i.postimg.cc/sXWkLzBq/image.png", desc: {ar: "وعاء سكر بتصميم متناسق مع الأطقم.", en: "A sugar bowl with a matching design."} },
        { id: 13, name: {ar: "كأس مشروبات باردة", en: "Iced Drink Glass"}, price: 75, oldPrice: 100, img: "https://i.postimg.cc/G2R0GZzN/image.png", desc: {ar: "كأس كبير للمشروبات الباردة والثلج.", en: "A large glass for cold drinks and ice."} },
        { id: 14, name: {ar: "صينية تقديم", en: "Serving Tray"}, price: 350, oldPrice: 450, img: "https://i.postimg.cc/PqYyZJtQ/image.png", desc: {ar: "صينية تقديم معدنية بلمسة ذهبية.", en: "A metal serving tray with a golden touch."} },
        { id: 15, name: {ar: "فنجان إسبريسو", en: "Espresso Cup"}, price: 60, oldPrice: 80, img: "https://i.postimg.cc/t4xLzWjJ/image.png", desc: {ar: "فنجان صغير مخصص لقهوة الإسبريسو.", en: "A small cup dedicated to espresso coffee."} },
        { id: 16, name: {ar: "كأس عصير بقاعدة", en: "Stemmed Juice Glass"}, price: 85, oldPrice: 115, img: "https://i.postimg.cc/kXzYcZzV/image.png", desc: {ar: "كأس عصير بقاعدة طويلة لمظهر أنيق.", en: "A stemmed juice glass for an elegant look."} },
        { id: 17, name: {ar: "إبريق ماء زجاجي", en: "Glass Water Pitcher"}, price: 200, oldPrice: 250, img: "https://i.postimg.cc/WbXyFpG0/image.png", desc: {ar: "إبريق ماء زجاجي مع غطاء.", en: "A glass water pitcher with a lid."} },
        { id: 18, name: {ar: "طقم ملاعق ذهبية", en: "Golden Spoon Set"}, price: 180, oldPrice: 240, img: "https://i.postimg.cc/L6RkYj2J/image.png", desc: {ar: "طقم من 6 ملاعق صغيرة بطلاء ذهبي.", en: "A set of 6 small spoons with gold plating."} },
        { id: 19, name: {ar: "كأس كوكتيل", en: "Cocktail Glass"}, price: 95, oldPrice: 130, img: "https://i.postimg.cc/YqCg2zGr/image.png", desc: {ar: "كأس بتصميم عصري لتقديم الكوكتيلات.", en: "A modern design glass for serving cocktails."} },
        { id: 20, name: {ar: "حامل كؤوس", en: "Glass Holder"}, price: 220, oldPrice: 280, img: "https://i.postimg.cc/pX3RjVSH/image.png", desc: {ar: "حامل معدني أنيق لتجفيف وتعليق الكؤوس.", en: "An elegant metal holder for drying and hanging glasses."} },
    ];

    const langText = {
        ar: {
            viewProducts: "عرض منتوجات NOUVA SHOP",
            ourProducts: "منتجاتنا",
            addToCart: "أضف للسلة",
            shoppingCart: "سلة المشتريات",
            total: "المجموع:",
            orderNow: "اطلب الآن",
            emptyCart: "تفريغ السلة",
            completeOrder: "إتمام الطلب",
            fullNamePlaceholder: "الإسم الكامل",
            cityPlaceholder: "اختر المدينة",
            phonePlaceholder: "رقم الهاتف",
            confirmOrder: "تأكيد الطلب عبر واتساب",
            adminLogin: "ولوج المسؤول",
            login: "دخول",
            orderSuccess: "تم الطلب بنجاح!",
            productDesc: "مواصفات المنتج",
            socialMedia: "مواقع التواصل",
            aboutUsFooter: "حول المتجر",
            whoWeAre: "من نحن",
            contactUs: "اتصل بنا",
            aboutNouva: "نبذة عن Nouva shop",
        },
        en: {
            viewProducts: "View NOUVA SHOP Products",
            ourProducts: "Our Products",
            addToCart: "Add to Cart",
            shoppingCart: "Shopping Cart",
            total: "Total:",
            orderNow: "Order Now",
            emptyCart: "Empty Cart",
            completeOrder: "Complete Your Order",
            fullNamePlaceholder: "Full Name",
            cityPlaceholder: "Select City",
            phonePlaceholder: "Phone Number",
            confirmOrder: "Confirm Order via WhatsApp",
            adminLogin: "Admin Login",
            login: "Login",
            orderSuccess: "Order placed successfully!",
            productDesc: "Product Specifications",
            socialMedia: "Social Media",
            aboutUsFooter: "About Us",
            whoWeAre: "Who We Are",
            contactUs: "Contact Us",
            aboutNouva: "About Nouva shop",
        }
    };

    // --- FUNCTIONS ---

    // Admin Panel
    const handleLogoClick = () => {
        logoClickCount++;
        if (logoClickCount === 5) {
            adminLoginModal.classList.remove('hidden');
            logoClickCount = 0; // Reset counter
        }
    };

    const handleAdminLogin = () => {
        if (adminPasswordInput.value === 'NOUVAshop@23/09/2000') {
            alert('Welcome Admin! (This is a demo. Real admin panel would load here.)');
            adminLoginModal.classList.add('hidden');
            // Here you would typically redirect to an admin page or show admin tools
        } else {
            alert('Incorrect Password!');
        }
        adminPasswordInput.value = '';
    };

    // Product Rendering
    const renderProducts = () => {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const price = currentCurrency === 'EUR' ? (product.price / exchangeRate).toFixed(2) : product.price.toFixed(2);
            const oldPrice = currentCurrency === 'EUR' ? (product.oldPrice / exchangeRate).toFixed(2) : product.oldPrice.toFixed(2);
            const currencySymbol = currentCurrency === 'EUR' ? '€' : 'درهم';

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;

            const quantityInCart = cart[product.id] || 0;

            productCard.innerHTML = `
                <img src="${product.img}" alt="${product.name[currentLang]}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name[currentLang]}</h3>
                    <div class="price-container">
                        <span class="original-price">${oldPrice} ${currencySymbol}</span>
                        <span class="sale-price">${price} ${currencySymbol}</span>
                    </div>
                    ${quantityInCart > 0 ? `
                        <div class="product-controls">
                            <button class="quantity-btn minus-btn" data-id="${product.id}">-</button>
                            <span class="quantity-display">${quantityInCart}</span>
                            <button class="quantity-btn plus-btn" data-id="${product.id}">+</button>
                        </div>
                    ` : `
                        <button class="add-to-cart-btn" data-id="${product.id}" data-lang-key="addToCart">${langText[currentLang].addToCart}</button>
                    `}
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    };
    
    // Cart Management
    const updateCart = (productId, quantity) => {
        if (quantity <= 0) {
            delete cart[productId];
        } else {
            cart[productId] = quantity;
        }
        localStorage.setItem('nouvaShopCart', JSON.stringify(cart));
        renderProducts();
        renderCart();
        updateCartIcon();
    };

    const handleProductInteraction = (e) => {
        const target = e.target;
        const productId = target.dataset.id;

        if (!productId) {
            // If the click is on the card but not a button, show details
            const card = target.closest('.product-card');
            if (card) {
                showProductDetails(card.dataset.id);
            }
            return;
        }

        const currentQuantity = cart[productId] || 0;

        if (target.classList.contains('add-to-cart-btn') || target.classList.contains('plus-btn')) {
            updateCart(productId, currentQuantity + 1);
            cartIcon.classList.add('animate');
            setTimeout(() => cartIcon.classList.remove('animate'), 600);
        } else if (target.classList.contains('minus-btn')) {
            updateCart(productId, currentQuantity - 1);
        }
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = `<p>${currentLang === 'ar' ? 'سلتك فارغة.' : 'Your cart is empty.'}</p>`;
            cartTotal.textContent = '0.00';
            return;
        }

        for (const productId in cart) {
            const product = products.find(p => p.id == productId);
            const quantity = cart[productId];
            const price = currentCurrency === 'EUR' ? (product.price / exchangeRate) : product.price;
            total += quantity * price;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${product.img}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name[currentLang]}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus-btn" data-id="${productId}">-</button>
                        <span class="quantity-display">${quantity}</span>
                        <button class="quantity-btn plus-btn" data-id="${productId}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">${(quantity * price).toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(cartItem);
        }
        cartTotal.textContent = total.toFixed(2);
    };

    const updateCartIcon = () => {
        const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
        cartCount.textContent = totalItems;
    };

    const clearCart = () => {
        cart = {};
        localStorage.removeItem('nouvaShopCart');
        renderProducts();
        renderCart();
        updateCartIcon();
        if(cartSidebar.classList.contains('open')) {
            cartSidebar.classList.remove('open');
        }
    };

    // Checkout
    const handleCheckout = (e) => {
        e.preventDefault();
        const name = document.getElementById('customer-name').value;
        const cityElement = document.getElementById('customer-city');
        const city = cityElement.options[cityElement.selectedIndex].text;
        const shippingCost = parseFloat(cityElement.options[cityElement.selectedIndex].dataset.cost);
        const phone = document.getElementById('customer-phone').value;

        let orderSummary = `*طلب جديد من NOUVA SHOP*\n\n`;
        orderSummary += `*الاسم:* ${name}\n`;
        orderSummary += `*المدينة:* ${city}\n`;
        orderSummary += `*الهاتف:* ${phone}\n\n`;
        orderSummary += `*المنتجات المطلوبة:*\n`;

        let subtotal = 0;
        for (const productId in cart) {
            const product = products.find(p => p.id == productId);
            const quantity = cart[productId];
            subtotal += product.price * quantity;
            orderSummary += `- ${product.name.ar} (x${quantity}) : ${product.price * quantity} درهم\n`;
        }
        
        const total = subtotal + shippingCost;
        orderSummary += `\n*سعر التوصيل:* ${shippingCost} درهم\n`;
        orderSummary += `*المجموع الإجمالي:* ${total} درهم\n\n`;
        orderSummary += `شكراً لثقتكم!`;

        const whatsappUrl = `https://wa.me/212623999334?text=${encodeURIComponent(orderSummary)}`;
        
        window.open(whatsappUrl, '_blank');

        checkoutModal.classList.add('hidden');
        clearCart();
        alert(langText[currentLang].orderSuccess);
    };

    // Currency & Language
    const fetchExchangeRate = async () => {
        try {
            // Using a free, no-key API. Replace if you have a premium one.
            const response = await fetch('https://api.frankfurter.app/latest?from=MAD&to=EUR');
            const data = await response.json();
            exchangeRate = data.rates.EUR;
        } catch (error) {
            console.error("Could not fetch exchange rate:", error);
            exchangeRate = 0.092; // Fallback rate
        }
    };

    const toggleCurrency = () => {
        currentCurrency = currentCurrency === 'MAD' ? 'EUR' : 'MAD';
        currencySwitcher.textContent = currentCurrency === 'MAD' ? 'EUR (€)' : 'MAD (درهم)';
        document.querySelector('.currency-symbol').textContent = currentCurrency === 'EUR' ? '€' : 'درهم';
        renderProducts();
        renderCart();
    };

    const toggleLanguage = () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        const isRTL = currentLang === 'ar';
        
        document.documentElement.lang = currentLang;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        langSwitcher.textContent = isRTL ? 'English' : 'العربية';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (langText[currentLang][key]) {
                if (el.placeholder) {
                    el.placeholder = langText[currentLang][key];
                } else {
                    el.textContent = langText[currentLang][key];
                }
            }
        });
        renderProducts();
        renderCart();
    };

    // Product Details Modal
    const showProductDetails = (productId) => {
        const product = products.find(p => p.id == productId);
        if (!product) return;

        const price = currentCurrency === 'EUR' ? (product.price / exchangeRate).toFixed(2) : product.price.toFixed(2);
        const oldPrice = currentCurrency === 'EUR' ? (product.oldPrice / exchangeRate).toFixed(2) : product.oldPrice.toFixed(2);
        const currencySymbol = currentCurrency === 'EUR' ? '€' : 'درهم';

        productModalContent.innerHTML = `
            <button id="close-product-modal" class="close-btn">&times;</button>
            <div class="product-modal-body">
                <img src="${product.img}" alt="${product.name[currentLang]}" class="product-modal-img">
                <div class="product-modal-details">
                    <h4>${product.name[currentLang]}</h4>
                    <p>${product.desc[currentLang]}</p>
                    <div class="price-container">
                        <span class="original-price">${oldPrice} ${currencySymbol}</span>
                        <span class="sale-price">${price} ${currencySymbol}</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}" data-lang-key="addToCart">${langText[currentLang].addToCart}</button>
                </div>
            </div>
        `;
        productModal.classList.remove('hidden');

        document.getElementById('close-product-modal').addEventListener('click', () => productModal.classList.add('hidden'));
        productModalContent.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            handleProductInteraction(e);
            productModal.classList.add('hidden');
        });
    };

    // --- EVENT LISTENERS ---
    logoContainer.addEventListener('click', handleLogoClick);
    closeAdminLoginModal.addEventListener('click', () => adminLoginModal.classList.add('hidden'));
    adminLoginBtn.addEventListener('click', handleAdminLogin);
    
    viewProductsBtn.addEventListener('click', () => {
        productsSection.classList.toggle('hidden');
        if (!productsSection.classList.contains('hidden')) {
            viewProductsBtn.scrollIntoView({ behavior: 'smooth' });
        }
    });

    productGrid.addEventListener('click', handleProductInteraction);
    cartItemsContainer.addEventListener('click', handleProductInteraction);

    cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    
    cancelOrderBtn.addEventListener('click', clearCart);
    orderNowBtn.addEventListener('click', () => {
        if (Object.keys(cart).length > 0) {
            checkoutModal.classList.remove('hidden');
        } else {
            alert(currentLang === 'ar' ? 'سلتك فارغة!' : 'Your cart is empty!');
        }
    });
    closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.add('hidden'));
    checkoutForm.addEventListener('submit', handleCheckout);

    currencySwitcher.addEventListener('click', toggleCurrency);
    langSwitcher.addEventListener('click', toggleLanguage);

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
        }
    });

    // --- INITIALIZATION ---
    const initializePage = async () => {
        await fetchExchangeRate();
        renderProducts();
        updateCartIcon();
        renderCart();
    };

    initializePage();
});
