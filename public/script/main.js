window.addEventListener('DOMContentLoaded', () => {
    const currentPathname = window.location.pathname

    switch (currentPathname) {
        case '/': {
            setActiveNavItem(currentPathname)
            changeContentSwiper()
            getDataProductsPopular()
            break
        }
        case '/menu': {
            setActiveNavItem(currentPathname)
            setActiveItemCategoryProduct()
            getDataProductsForMenu()
            break
        }
        case '/delivery': {
            setActiveNavItem(currentPathname)
            break
        }
        case '/action': {
            setActiveNavItem(currentPathname)
            break
        }
        case '/about': {
            setActiveNavItem(currentPathname)
            break
        }
        case '/reviews': {
            setActiveNavItem(currentPathname)
            break
        }
        case '/contacts': {
            setActiveNavItem(currentPathname)
            break
        }
    }

    updateQuantityBasket()
    renderingSectionWriteToUs()
    console.log('https://dostavka-lending.demoultron.ru - the original site of the copyright holder');
})

function setActiveNavItem(currentPathname) {
    const dataHeaderArray = document.querySelectorAll('[data-header]')

    dataHeaderArray.forEach((header) => {
        header.dataset.header === currentPathname ? (header.classList.remove('header__wrapper__nav-lis-item'), header.classList.add('header__wrapper__nav-lis-item--active')) : null
    })
}

function getDataProductsPopular() {
    fetch('/getDataProductsTag?filter=Популярное')
    .then(response => response.json())
    .then(data => fillDataProducts(data, document.querySelector('#productsPopularContainer')))
    .catch(err => console.log(err))
}

function fillDataProducts(productsData, productsDataContainer) {
    const productsContainer = productsDataContainer;
    
    productsContainer.innerHTML = '';

    productsData.dataProducts.forEach((product) => {
        const productCardWrapper = createProdcutsPopularCard(product);
        productsContainer.appendChild(productCardWrapper);
        getCardOptionsSize(product, productCardWrapper);
    });
    
    selectCardOptionsSize(productsData);
    renderingProductsCard();
    saveProductBasket(); 
}

function createProdcutsPopularCard(product) {
    const productCardWrapper = document.createElement('div')
    productCardWrapper.classList.add('main__section__popular-dishes__content-products-card')
    productCardWrapper.setAttribute('data-product', '')
    productCardWrapper.innerHTML = 
    `<img src="/img/products/${product.img}" alt="product" class="main__section__popular-dishes__content-products-card-img" draggable="false">
    <h1 class="main__section__popular-dishes__content-products-card-title">${product.title}</h1>
    <p class="main__section__popular-dishes__content-products-card-desc">${product.desc}</p>

    <div class="main__section__popular-dishes__content-products-card-select" data-select>
        <div class="main__section__popular-dishes__content-products-card-select-wrapper">
            <p class="main__section__popular-dishes__content-products-card-select-wrapper-choice" id="productCardOptionsChoice">23 см.</p>
            <img style="width: 11px; height: 7px;" src="/img/styler-arrow.png" alt="arrow">
        </div>

        <div class="main__section__popular-dishes__content-products-card-select-wrapper-list" style="display: none; opacity: 0;" id="productCardOptionsList"></div>                          
    </div>

    <div class="main__section__popular-dishes__content-products-card-price-and-grams">
        <p class="main__section__popular-dishes__content-products-card-price"><span class="main__section__popular-dishes__content-products-card-price-discount"><span id="product-discount">${product.discount}</span> руб.</span> <span class="main__section__popular-dishes__content-products-card-price-basic" id="product-price">${product.price}</span> руб.</p>
        <p class="main__section__popular-dishes__content-products-card-grams">Вес: <span id="product-gramming">${product.gramming}</span>гр.</p>
    </div>

    <div class="main__section__popular-dishes__content-products-card-counter-and-buy">
        <div class="main__section__popular-dishes__content-products-card-counter-wrapper" id="productCardCounterWrapper">
            <button type="button" class="main__section__popular-dishes__content-products-card-counter-wrapper-button">-</button>
            <input type="text" class="main__section__popular-dishes__content-products-card-counter-wrapper-quantity" value="1" id="product-counter">
            <button type="button" class="main__section__popular-dishes__content-products-card-counter-wrapper-button">+</button>
        </div>

        <button type="button" class="ready-button" style="width: 124px; height: 40px;" data-product-save>В корзину</button>
    </div>

    <div class="main__section__popular-dishes__content-products-card-tag" id="product-tag">${product.tag}</div>`

    renderingProductTag(product.tag, productCardWrapper.querySelector('#product-tag'))
    renderingProductGramming(product.gramming, productCardWrapper.querySelector('#product-gramming'))
    
    return productCardWrapper
}

function renderingProductTag(productTag, productTagWrapper) {
    switch (productTag) {
        case '': {
            productTagWrapper.remove()
            break
        }
        case 'Популярное': {
            productTagWrapper.classList.add('main__section__popular-dishes__content-products-card-tag--popular');
            break
        }
        case 'Новинка': {
            productTagWrapper.classList.add('main__section__popular-dishes__content-products-card-tag--novelty')
            break
        }
        case 'Акция!': {
            productTagWrapper.classList.add('main__section__popular-dishes__content-products-card-tag--action')
            break
        }
    }
}

function renderingProductGramming(productGramming, productGrammingWrapper) {
    productGramming === '' ? productGrammingWrapper.parentNode.remove() : null
}

function getCardOptionsSize(product, productCardWrapper) {
    const productCardOptionsList = productCardWrapper.querySelector('#productCardOptionsList')

    if (product['options-select-size'].length === 0) {
        productCardOptionsList.parentNode.remove()
    } else {
        fillCardOptionSize(product, productCardOptionsList.parentNode)
    }
}

function fillCardOptionSize(product, productCardOptionsList) {
    const productCardOptionsChoise = productCardOptionsList.querySelector('#productCardOptionsChoice')

    for (const key in product['options-select-size'][0]) {
        productCardOptionsChoise.innerHTML = key
    }

    product['options-select-size'].forEach((options) => {
        for (const key in options) {
            const productCardOptionsListItem = document.createElement('li')
            productCardOptionsListItem.classList.add('main__section__popular-dishes__content-products-card-select-wrapper', 'main__section__popular-dishes__content-products-card-select-wrapper-choice', 'main__section__popular-dishes__content-products-card-select-wrapper-list-item-hover')
            productCardOptionsListItem.innerHTML = key

            productCardOptionsList.querySelector('#productCardOptionsList').appendChild(productCardOptionsListItem)
        }
    })

    productCardOptionsList.querySelector('#productCardOptionsList').children[0].classList.add('main__section__popular-dishes__content-products-card-select-wrapper-choice-item-active')
    productCardOptionsList.querySelector('#productCardOptionsList').children[0].classList.remove('main__section__popular-dishes__content-products-card-select-wrapper-list-item-hover')
}

// Функция для сохранения товаров в корзину
function saveProductBasket() {
    const buttonProductSaveArray = Array.from(document.querySelectorAll('[data-product-save]'));
    
    buttonProductSaveArray.forEach((btn) => {
        btn.addEventListener('click', () => {
            try {
                const productCard = btn.closest('.main__section__popular-dishes__content-products-card');
                if (!productCard) {
                    throw new Error('Не удалось найти карточку товара');
                }

                const productCounter = parseInt(productCard.querySelector('#product-counter').value);
                
                if (isNaN(productCounter) || productCounter <= 0 || productCounter > 10) {
                    throw new Error('Недопустимое количество товара');
                }

                const productInformation = {
                    id: productCard.dataset.productId || Date.now().toString(),
                    title: productCard.querySelector('.main__section__popular-dishes__content-products-card-title').textContent,
                    desc: productCard.querySelector('.main__section__popular-dishes__content-products-card-desc').textContent,
                    price: productCard.querySelector('#product-price').textContent,
                    counter: productCounter,
                    gramming: productCard.querySelector('#product-gramming').textContent,
                    discount: productCard.querySelector('#product-discount')?.textContent || '',
                    image: productCard.querySelector('.main__section__popular-dishes__content-products-card-img')?.src || '/images/default-product.jpg'
                };

                let savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
                const existingIndex = savedProducts.findIndex(p => p.id === productInformation.id);
                
                // Проверка общего количества
                const totalCount = savedProducts.reduce((sum, p) => sum + p.counter, 0);
                if (totalCount + productInformation.counter > 99) {
                    showToast(`Превышено максимальное количество товаров (${totalCount + productInformation.counter}/99)`, 'error');
                    return;
                }

                if (existingIndex !== -1) {
                    // Обновляем существующий товар
                    savedProducts[existingIndex].counter += productInformation.counter;
                    showToast(`Товар обновлен (${savedProducts[existingIndex].counter} шт.)`, 'success');
                } else {
                    // Добавляем новый товар
                    savedProducts.push(productInformation);
                    showToast('Товар добавлен в корзину', 'success');
                }

                localStorage.setItem('productSavedInformation', JSON.stringify(savedProducts));
                updateQuantityBasket();
                
            } catch (err) {
                console.error('Ошибка при добавлении товара:', err);
                showToast(err.message || 'Ошибка при добавлении товара', 'error');
            }
        });
    });
}

// Функция для отображения корзины
function renderBasketPage() {
    const mainElement = document.querySelector('.basket-main');
    if (!mainElement) return;

    const savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
    
    if (savedProducts.length === 0) {
        mainElement.innerHTML = `
            <section class="basket-section">
                <div class="basket-empty">
                    <div class="basket-empty-icon">🛒</div>
                    <h3 class="basket-empty-title">Ваша корзина пуста</h3>
                    <p class="basket-empty-text">Добавьте товары из каталога</p>
                    <button class="basket-empty-button" onclick="window.location.href='/menu'">Перейти в каталог</button>
                </div>
            </section>
        `;
        return;
    }

    // Подсчет общей суммы
    const totalPrice = savedProducts.reduce((sum, product) => {
        const price = parseFloat(product.price.replace(/[^\d.]/g, '')) * product.counter;
        return sum + price;
    }, 0);

    // Генерация HTML для товаров
    const productsHTML = savedProducts.map(product => {
        const price = parseFloat(product.price.replace(/[^\d.]/g, '')) * product.counter;
        const originalPrice = product.discount ? 
            parseFloat(product.discount.replace(/[^\d.]/g, '')) * product.counter : 0;
        
        return `
            <div class="basket-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.title}" class="basket-item-img">
                <div class="basket-item-info">
                    <h3 class="basket-item-title">${product.title}</h3>
                    <p class="basket-item-desc">${product.desc}</p>
                    <div class="basket-item-meta">
                        <span>${product.gramming}</span>
                    </div>
                </div>
                <div class="basket-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-product-id="${product.id}">−</button>
                        <span class="quantity-value">${product.counter}</span>
                        <button class="quantity-btn plus" data-product-id="${product.id}">+</button>
                    </div>
                    <div class="basket-item-price">
                        ${product.discount ? `
                            <span class="basket-item-discount">${originalPrice.toFixed(2)} ₽</span>
                        ` : ''}
                        ${price.toFixed(2)} ₽
                    </div>
                    <button class="remove-item" data-product-id="${product.id}">
                        <svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
                        Удалить
                    </button>
                </div>
            </div>
        `;
    }).join('');

    mainElement.innerHTML = `
        <section class="basket-section">
            <div class="basket-header">
                <h2>Корзина</h2>
                <span class="basket-total-items">${savedProducts.reduce((sum, p) => sum + p.counter, 0)} товаров</span>
            </div>
            <div class="basket-items">
                ${productsHTML}
            </div>
            <div class="basket-total">
                <div class="basket-total-sum">
                    Итого: <span>${totalPrice.toFixed(2)} ₽</span>
                </div>
                <button class="checkout-button">Оформить заказ</button>
            </div>
        </section>
    `;

    // Добавляем обработчики
    addBasketItemEventListeners();
}

// Функция для добавления обработчиков событий
function addBasketItemEventListeners() {
    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            removeProductFromBasket(productId);
        });
    });

    // Увеличение количества
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            updateProductQuantity(productId, 1);
        });
    });

    // Уменьшение количества
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            updateProductQuantity(productId, -1);
        });
    });

    // Оформление заказа
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Функция обновления количества товара
function updateProductQuantity(productId, change) {
    let savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
    const productIndex = savedProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;

    const newQuantity = savedProducts[productIndex].counter + change;
    
    // Проверка на минимальное и максимальное количество
    if (newQuantity <= 0) {
        removeProductFromBasket(productId);
        return;
    }
    
    if (newQuantity > 10) {
        showToast('Максимальное количество одного товара - 10 шт.', 'error');
        return;
    }

    // Проверка общего количества товаров
    const totalCount = savedProducts.reduce((sum, p) => sum + (p.id === productId ? newQuantity : p.counter), 0);
    if (totalCount > 99) {
        showToast(`Превышено максимальное количество товаров (${totalCount}/99)`, 'error');
        return;
    }

    savedProducts[productIndex].counter = newQuantity;
    localStorage.setItem('productSavedInformation', JSON.stringify(savedProducts));
    renderBasketPage();
    updateQuantityBasket();
    showToast(`Количество изменено: ${newQuantity} шт.`, 'success');
}

// Функция удаления товара
function removeProductFromBasket(productId) {
    let savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
    savedProducts = savedProducts.filter(p => p.id !== productId);
    localStorage.setItem('productSavedInformation', JSON.stringify(savedProducts));
    renderBasketPage();
    updateQuantityBasket();
    showToast('Товар удален из корзины', 'success');
}

// Функция оформления заказа
function proceedToCheckout() {
    const savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
    if (savedProducts.length === 0) {
        showToast('Корзина пуста', 'error');
        return;
    }
    
    // Здесь можно добавить переход на страницу оформления заказа
    document.querySelector('#writeToUsBtnOpen').click()
    showToast('Переход к оформлению заказа', 'success');
}

// Функция обновления счетчика в шапке
function updateBasketCounter() {
    const savedProducts = JSON.parse(localStorage.getItem('productSavedInformation')) || [];
    const totalCount = savedProducts.reduce((sum, p) => sum + p.counter, 0);
    
    // Безопасная проверка элементов
    const basketCounter = document.querySelector('.basket-counter');
    if (basketCounter) {
        basketCounter.textContent = totalCount;
        basketCounter.style.display = totalCount > 0 ? 'flex' : 'none';
    }
    
    const mobileBasketCounter = document.querySelector('.mobile-basket-counter');
    if (mobileBasketCounter) {
        mobileBasketCounter.textContent = totalCount;
        mobileBasketCounter.style.display = totalCount > 0 ? 'flex' : 'none';
    }
}

// Вспомогательная функция для показа уведомлений
function showToast(message, type = 'info') {
    if (!document.body) {
        console.log('Toast message:', message);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('basket')) {
        renderBasketPage();
    } else {
        saveProductBasket();
    }
    updateQuantityBasket();
});

// function saveProductBasket() {
//     const buttonProductSaveArray = Array.from(document.querySelectorAll('[data-product-save]'))
    
//     buttonProductSaveArray.forEach((btn) => btn.addEventListener('click', () => {
//         try {
//             const productCard = btn.parentNode.parentNode
//             let vereficationAdd = true
//             let quantityProductsCounter = 0

//             const productInformation = {
//                 productTitle: productCard.querySelector('.main__section__popular-dishes__content-products-card-title').innerHTML,
//                 productDesc: productCard.querySelector('.main__section__popular-dishes__content-products-card-desc').innerHTML,
//                 productPrice: productCard.querySelector('#product-price').innerHTML,
//                 productCounter: parseInt(productCard.querySelector('#product-counter').value),
//                 productGramming: productCard.querySelector('#product-gramming').innerHTML,
//                 productDiscount: productCard.querySelector('#product-discount')
//             }
//             productInformation.productDiscount === null ? productInformation.productDiscount = '' : productInformation.productDiscount = productCard.querySelector('#product-discount').innerHTML
//             if (productInformation.productCounter <= 0 || productInformation.productCounter > 10) {throw new Error()}

//             if (JSON.parse(localStorage.getItem('productSavedInformation'))) {
//                 JSON.parse(localStorage.getItem('productSavedInformation')).forEach((product) => {
//                     quantityProductsCounter += product.productCounter

//                     if (quantityProductsCounter + productInformation.productCounter > 99) {
//                         const sectionInformationPanelCardText = `Ошибка добавления в корзину: неверное количество "${quantityProductsCounter + productInformation.productCounter}"`
//                         const sectionInformationPanelCardColor = 'red'
//                         showContentInInformationPanel(sectionInformationPanelCardText, sectionInformationPanelCardColor)
//                         vereficationAdd = false
//                         return
//                     }

//                     if (product.productTitle === productInformation.productTitle) {
//                         vereficationAdd = false

//                         const productsInformationLocalStorageNew = JSON.parse(localStorage.getItem('productSavedInformation'))
//                         productsInformationLocalStorageNew.forEach((product) => {
//                             if (product.productTitle === productInformation.productTitle) {
//                                 product.productCounter = product.productCounter + productInformation.productCounter
//                                 const sectionInformationPanelCardText = `Количество товара в корзине успешно изменено: ${product.productCounter}`
//                                 const sectionInformationPanelCardColor = 'green'
//                                 showContentInInformationPanel(sectionInformationPanelCardText, sectionInformationPanelCardColor)
//                             }
//                         })

//                         localStorage.setItem('productSavedInformation', JSON.stringify(productsInformationLocalStorageNew))
//                         updateQuantityBasket()
//                     }
//                 })
//             }

//             if (vereficationAdd) {
//                 const savedProductPromise = new Promise((resolve, reject) => {
//                     const productSavedInformation = JSON.parse(localStorage.getItem('productSavedInformation')) || []
//                     productSavedInformation.push(productInformation)
//                     localStorage.setItem('productSavedInformation', JSON.stringify(productSavedInformation))
    
//                     localStorage.getItem('productSavedInformation') ? resolve() : reject()
//                 })
    
//                 savedProductPromise
//                 .then(() => {
//                     const sectionInformationPanelCardText = `Товар успешно добавлен в корзину: ${productInformation.productCounter}`
//                     const sectionInformationPanelCardColor = 'green'
//                     updateQuantityBasket()
//                     showContentInInformationPanel(sectionInformationPanelCardText, sectionInformationPanelCardColor)
//                 })
//                 .catch(err => console.log(err))
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }))
// }

function updateQuantityBasket() {
    const basketQuantity = document.querySelector('#basket-quantity')
    let basketQuantityValue = 0

    if (localStorage.getItem('productSavedInformation')) {
        
        JSON.parse(localStorage.getItem('productSavedInformation')).forEach((product) => {
            basketQuantityValue += product.counter
        })
    }

    basketQuantity.innerHTML = basketQuantityValue
}

function showContentInInformationPanel(sectionInformationPanelCardText, sectionInformationPanelCardColor) {
    const sectionInformationPanelContainer = document.querySelector('[data-information-panel]')
    const sectionInformationPanelCard = document.createElement('div')
    sectionInformationPanelCard.classList.add('special-section-information-panel-card', `special-section-information-panel-card-${sectionInformationPanelCardColor}`)
    
    sectionInformationPanelCard.innerHTML =
    `<p class="special-section-information-panel-card-text">${sectionInformationPanelCardText}</p>
    <button type="button" class="special-section-information-panel-card-button-close" data-information-panel-close>&#xe5cd</button>`

    sectionInformationPanelContainer.appendChild(sectionInformationPanelCard)

    setTimeout(() => {
        sectionInformationPanelCard.remove()
    }, 5000)

    const informationPanelCloseArray = document.querySelectorAll('[data-information-panel-close]')
    informationPanelCloseArray.forEach((btn) => btn.addEventListener('click', () => {
        const informationPanelCloseParent = btn.parentNode
        informationPanelCloseParent.remove()
    }))
}

function renderingSectionWriteToUs() {
    const sectionWriteToUsBtnOpen = document.querySelector('#writeToUsBtnOpen')
    sectionWriteToUsBtnOpen.addEventListener('click', () => appendToBodySectionWriteToUs())

    function appendToBodySectionWriteToUs() {
        const sectionWriteToUs = document.createElement('div')
        sectionWriteToUs.classList.add('special-sections-write-to-us')
        sectionWriteToUs.innerHTML = 
        `<div class="special-sections-write-to-us-block">
            <div class="special-sections-write-to-us-content-content">

                <h1 class="special-sections-write-to-us-content-title" style="padding-bottom: 40px">Оставьте свою заявку, и мы перезвоним вам в течение 5 минут!</h1>
    
                <form action="/" class="special-sections-write-to-us-content-form" id="writeToUsForm">
                    <input id="writeToUsFormInput" type="text" class="special-sections-write-to-us-content-form-input" placeholder="Ваше имя *" data-writeToUsForm-required="true" data-writeToUsForm-ID="name">
                    <input id="writeToUsFormInput" type="text" class="special-sections-write-to-us-content-form-input" placeholder="Телефон *" data-writeToUsForm-required="true" data-writeToUsForm-ID="phone">
                    <textarea id="writeToUsFormInput" class="special-sections-write-to-us-content-form-input special-sections-write-to-us-content-form-input-textarea" placeholder="Сообщение" data-writeToUsForm-required="false"></textarea>
    
                    <div class="special-sections-write-to-us-content-check-block">
                        <button id="writeToUsFormInput" type="button" class="special-sections-write-to-us-content-check-form-checkbox" data-checkbox-WriteToUs="false" data-writeToUsForm-required="true" data-writeToUsForm-ID="checkbox">&#xe835</button>
                        <p class="special-sections-write-to-us-content-check-form-text">Согласен на обработку персональных данных *</p>
                    </div>
        
                    <p class="special-sections-write-to-us-content-commitment-text"><span style="color: #D83638;">*</span> - поля, обязательные для заполнения</p>
        
                    <button type="submit" class="ready-button" style="margin-top: 20px;" id="writeToUsFormSubmit">Отправить</button>
                </form>
    
                <button type="button" class="special-sections-write-to-us-content-close-button" id="writeToUsBtnClose">&#xe5cd</button>
            </div>
        </div>`
        document.body.append(sectionWriteToUs)

        sectionWriteToUs.style.opacity = 0

        setTimeout(() => {
            sectionWriteToUs.style.opacity = 1
            sectionWriteToUs.style.transition = 'opacity 0.4s'
        }, 0);

        document.body.style.setProperty('overflow-y', 'hidden')

        const sectionWriteToUsCheckBox = sectionWriteToUs.querySelector('[data-checkbox-WriteToUs]')
        sectionWriteToUsCheckBox.addEventListener('click', (btn) => toggleCheckBoxSectionWriteToUs(btn))

        const sectionWriteToUsForm = sectionWriteToUs.querySelector('#writeToUsForm')
        const sectionWriteToUsFormInputArray = Array.from(sectionWriteToUs.querySelectorAll('#writeToUsFormInput'))
        sectionWriteToUsForm.addEventListener('submit', (event) => sendDataWriteToUsFormValidation(event, sectionWriteToUsFormInputArray))

        const sectionWriteToUsBtnClose = sectionWriteToUs.querySelector('#writeToUsBtnClose')
        const sectionWriteToUsBackgroundClose = document.querySelector('.special-sections-write-to-us')
        sectionWriteToUsBtnClose.addEventListener('click', () => deleteToBodySectionWriteToUs())
        sectionWriteToUsBackgroundClose.addEventListener('click', (el) => {
            el.target.classList.contains('special-sections-write-to-us') ? deleteToBodySectionWriteToUs() : null
        })
    }

    function toggleCheckBoxSectionWriteToUs(btn) {
        if (btn.target.dataset.checkboxWritetous === 'false') {
            btn.target.dataset.checkboxWritetous = 'true'
            btn.target.innerHTML = '&#xe834'
            btn.target.value = 'true'
        } else if (btn.target.dataset.checkboxWritetous === 'true') {
            btn.target.dataset.checkboxWritetous = 'false'
            btn.target.innerHTML = '&#xe835'
            btn.target.value = ''
        }
    }

    function sendDataWriteToUsFormValidation(event, sectionWriteToUsFormInputArray) {
        event.preventDefault()
        let checkFormValidation = true

        sectionWriteToUsFormInputArray.forEach((input) => {
            if (input.dataset.writetousformId === 'name' && input.value.length <= 3) {
                checkFormValidation = false
                input.disabled = true             
                input.classList.add('special-sections-write-to-us-content-form-input-error')

                setTimeout(() => {
                    input.disabled = false
                    input.classList.remove('special-sections-write-to-us-content-form-input-error')
                }, 5000);
            }
            if (input.dataset.writetousformId === 'phone' && input.value.length < 11) {
                checkFormValidation = false
                input.disabled = true             
                input.classList.add('special-sections-write-to-us-content-form-input-error')

                setTimeout(() => {
                    input.disabled = false
                    input.classList.remove('special-sections-write-to-us-content-form-input-error')
                }, 5000);
            }
            if (input.dataset.writetousformId === 'checkbox' && input.dataset.checkboxWritetous === 'false') {
                checkFormValidation = false
                input.disabled = true            
                Array.from(input.parentNode.children).forEach((el) => el.classList.add('special-sections-write-to-us-content-check-form-checkbox-error'))

                setTimeout(() => {
                    input.disabled = false
                    Array.from(input.parentNode.children).forEach((el) => el.classList.remove('special-sections-write-to-us-content-check-form-checkbox-error'))
                }, 5000);
            }  
        })

        checkFormValidation ? deleteToBodySectionWriteToUs() : null
    }

    function deleteToBodySectionWriteToUs() {
        const documentBodyChildrenArray = Array.from(document.body.children)

        documentBodyChildrenArray.forEach((el) => {
            el.classList.contains('special-sections-write-to-us') ? (el.style.opacity = 0, el.style.transition = 'opacity 0.25s', document.body.style.setProperty('overflow-y', 'inherit') ,setTimeout(() => el.remove(), 400)) : null
        })
    }
}

function changeContentSwiper() {
    setTimeout(() => {
        const dataSwiperArray = document.querySelectorAll('[data-swiper]')
        const dataSwiperBlocksArray = document.querySelectorAll('[data-sliderBlock]')
        const dataSwiperPaginationArray = document.querySelectorAll('[data-pagination]')
        const sectionSlider = document.querySelector('.main__section__slider')
        const sectionSliderImgArray = ['url(/img/sl01_1920x550_f41.jpg)', 'url(/img/sl02_1920x550_f41.jpg)']
        let intervalChangeSliderImage
        let currentImageIndex = 0
        let lastDate = 0
    
        intervalChangeSliderImage = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % sectionSliderImgArray.length
            sectionSlider.style.setProperty('--img', sectionSliderImgArray[currentImageIndex])
    
            dataSwiperPaginationArray.forEach((swiperPagination) => {
                swiperPagination.classList.remove('main__section__slider-content-button-swiper-pagination-thumb--active')
    
                if (swiperPagination.dataset.pagination == currentImageIndex) {
                    swiperPagination.classList.add('main__section__slider-content-button-swiper-pagination-thumb--active')
                }
            })
    
            dataSwiperBlocksArray.forEach((block) => {
                block.style.display = 'none'
                
                if (block.dataset.sliderblock == currentImageIndex) {
                    block.style.opacity = '0'
                    block.style.transition = 'opacity 2.5s ease-in-out'
                    block.style.display = 'flex'
    
                    setTimeout(() => {
                        block.style.opacity = '1'
                    }, 20);
                }
            })
        }, 8000);
    
        dataSwiperArray.forEach((swiperBtn) => {
            swiperBtn.addEventListener('click', () => {
                if (Date.now() - lastDate >= 2250) {
                    if (swiperBtn.dataset.swiper) {
                        clearInterval(intervalChangeSliderImage)
                        currentImageIndex = (currentImageIndex + 1) % sectionSliderImgArray.length
                        sectionSlider.style.setProperty('--img', sectionSliderImgArray[currentImageIndex])
    
                        dataSwiperPaginationArray.forEach((swiperPagination) => {
                            swiperPagination.classList.remove('main__section__slider-content-button-swiper-pagination-thumb--active')
                
                            if (swiperPagination.dataset.pagination == currentImageIndex) {
                                swiperPagination.classList.add('main__section__slider-content-button-swiper-pagination-thumb--active')
                            }
                        })
    
                        dataSwiperBlocksArray.forEach((block) => {
                            block.style.display = 'none'
                            
                            if (block.dataset.sliderblock == currentImageIndex) {
                                block.style.opacity = '0'
                                block.style.transition = 'opacity 2.5s ease-in-out'
                                block.style.display = 'flex'
    
                                setTimeout(() => {
                                    block.style.opacity = '1'
                                }, 20);
                            }
                        })
    
                        intervalChangeSliderImage = setInterval(() => {
                            currentImageIndex = (currentImageIndex + 1) % sectionSliderImgArray.length
                            sectionSlider.style.setProperty('--img', sectionSliderImgArray[currentImageIndex])
    
                            dataSwiperPaginationArray.forEach((swiperPagination) => {
                                swiperPagination.classList.remove('main__section__slider-content-button-swiper-pagination-thumb--active')
                    
                                if (swiperPagination.dataset.pagination == currentImageIndex) {
                                    swiperPagination.classList.add('main__section__slider-content-button-swiper-pagination-thumb--active')
                                }
                            })
                    
                            dataSwiperBlocksArray.forEach((block) => {
                                block.style.display = 'none'
                                
                                if (block.dataset.sliderblock == currentImageIndex) {
                                    block.style.opacity = '0'
                                    block.style.transition = 'opacity 2.5s ease-in-out'
                                    block.style.display = 'flex'
                    
                                    setTimeout(() => {
                                        block.style.opacity = '1'
                                    }, 20);
                                }
                            })
                        }, 8000);
    
                        lastDate = Date.now()
                    }
                }
            })
        })
    }, 1);
}

function selectCardOptionsSize(data) {
    const selectCardOptionsArray = document.querySelectorAll('[data-select]')

    selectCardOptionsArray.forEach((select) => {
        const selectCardOptionsItemArray = Array.from(select.querySelector('.main__section__popular-dishes__content-products-card-select-wrapper-list').children)
        const selectImgArrow = select.querySelector('.main__section__popular-dishes__content-products-card-select-wrapper img')
        const selectList = select.children[1]

        select.addEventListener('click', () => {
            if (selectList.style.display === 'none') {
                Array.from(selectCardOptionsArray).forEach((select) => {
                    if (select.children[1]) {
                        select.children[1].style.display = 'none'
                        select.children[1].parentNode.querySelector('.main__section__popular-dishes__content-products-card-select-wrapper img').style.transform = 'rotate(360deg)'
                        select.children[1].parentNode.querySelector('.main__section__popular-dishes__content-products-card-select-wrapper img').style.transform = 'rotate(0deg)'
                    }
                })
                
                selectList.style.display = 'inherit'
                selectImgArrow.style.transform = 'rotate(180deg)'

                selectList.style.opacity= '1'
            } else {  
                selectImgArrow.style.transform = 'rotate(360deg)'
                selectList.style.opacity = '0'          
                selectList.style.display = 'none'
                selectImgArrow.style.transform = 'rotate(0deg)';
            }
        })

        selectCardOptionsItemArray.forEach((optionsItem) => {
            optionsItem.addEventListener('click', () => {
                if (!optionsItem.classList.contains('main__section__popular-dishes__content-products-card-select-wrapper-choice-item-active')) {
                    selectCardOptionsItemArray.forEach((optionsItem) => {
                        optionsItem.classList.add('main__section__popular-dishes__content-products-card-select-wrapper-list-item-hover')
                        optionsItem.classList.remove('main__section__popular-dishes__content-products-card-select-wrapper-choice-item-active')
                    })
    
                    optionsItem.classList.add('main__section__popular-dishes__content-products-card-select-wrapper-choice-item-active')
                    optionsItem.classList.remove('main__section__popular-dishes__content-products-card-select-wrapper-list-item-hover')

                    const selectSizeChoiceParent = optionsItem.parentNode.parentNode.parentNode
                    const selectSizeChoiceTitleCard = selectSizeChoiceParent.querySelector('.main__section__popular-dishes__content-products-card-title').innerHTML
                    data.dataProducts.forEach((product) => {
                        if (product.title === selectSizeChoiceTitleCard) {
                            product['options-select-size'].forEach((select) => {
                                if (select[optionsItem.innerHTML] !== undefined) {
                                    select[optionsItem.innerHTML].forEach((money) => {
                                        if (money.price !== undefined) {
                                            selectSizeChoiceParent.querySelector('#product-price').innerHTML = money.price
                                        }
                                        if (money.discount !== undefined) {
                                            selectSizeChoiceParent.querySelector('#product-discount').innerHTML = money.discount
                                        }
                                    })

                                    selectSizeChoiceParent.querySelector('#productCardOptionsChoice').innerHTML = optionsItem.innerHTML
                                }
                            })
                        }
                    })
                }
            })
        })
    })
}

function renderingProductsCard() {
    const productsCardArray = document.querySelectorAll('[data-product]')

    productsCardArray.forEach((productCard) => {
        deleteDiscountProductCard(productCard)
        toggleCounterProductCard(productCard)
        fillImgAltProductCard(productCard)
    })
}

function deleteDiscountProductCard(productCard) {
    const productDiscount = productCard.querySelector('#product-discount')

    if (productDiscount.innerHTML === '') {
        productDiscount.parentNode.remove()
    }
}

function toggleCounterProductCard(productCard) {
    const productCardCounterWrapper = productCard.querySelector('#productCardCounterWrapper')
    const productCardCounterValue = productCardCounterWrapper.querySelector('.main__section__popular-dishes__content-products-card-counter-wrapper-quantity')
    const productCardCounterButtons = Array.from(productCardCounterWrapper.querySelectorAll('.main__section__popular-dishes__content-products-card-counter-wrapper-button'))

    productCardCounterButtons.forEach((btn) => btn.addEventListener('click', () => {
        if (btn.textContent === '-') {
            productCardCounterValue.value > 1 ? productCardCounterValue.value = parseInt(productCardCounterValue.value) - 1 : null
        } else if (btn.textContent === '+') {
            productCardCounterValue.value < 10 ? productCardCounterValue.value = parseInt(productCardCounterValue.value) + 1 : null
        }
    }))

    productCardCounterValue.addEventListener('input', () => {
        productCardCounterValue.value = productCardCounterValue.value.replace(/[^\d]/g, '').trim()
    })

    productCardCounterValue.addEventListener('change', () => {
        if (parseInt(productCardCounterValue.value) <= 0 || productCardCounterValue.value === '') {
            productCardCounterValue.value = 1
        }
        if (parseInt(productCardCounterValue.value) > 10) {
            productCardCounterValue.value = 10
        }
    })
}

function fillImgAltProductCard(productCard) {
    const productCardImgAlt = productCard.querySelector('img')
    const productCardTitle = productCard.querySelector('.main__section__popular-dishes__content-products-card-title').textContent

    productCardImgAlt.setAttribute('alt', productCardTitle)
}

function setActiveItemCategoryProduct() {
    const productCategoryContainer = document.querySelector('#data-choice-product-category-container') 
    const productChoiceCategoryArray = Array.from(document.querySelectorAll('[data-choice-product-category]'))
    const productChoiceCategoryUnderline = document.querySelector('.main__section__menu-choice-category-list-item-underline')
    const productMenuContainer = document.querySelector('#products-menu-container')

    productChoiceCategoryArray.forEach((choice) => {
        if (choice.classList.contains('main__section__menu-choice-category-list-item--active')) {
            if (productCategoryContainer.children.length < 2) {
                renderingProductChoiceCategorySubmenu(choice, productCategoryContainer)
            }

            setTimeout(() => {       
                requestAnimationFrame(() => {
                    productChoiceCategoryUnderline.style.left = choice.offsetLeft + 'px'
                    productChoiceCategoryUnderline.style.width = choice.offsetWidth + 'px'
                })
            }, 20);
        }

        choice.addEventListener('click', () => {
            if (!choice.classList.contains('main__section__menu-choice-category-list-item--active')) {
                renderingProductChoiceCategorySubmenu(choice, productCategoryContainer)

                productMenuContainer.innerHTML = ''
                getDataProductsForMenu(choice.dataset.choiceProductCategory)

                productChoiceCategoryArray.forEach((choice) => (choice.classList.remove('main__section__menu-choice-category-list-item--active'), choice.classList.add('main__section__menu-choice-category-list-item')))
                choice.classList.remove('main__section__menu-choice-category-list-item')
                choice.classList.add('main__section__menu-choice-category-list-item--active')
    
                productChoiceCategoryUnderline.style.left = choice.offsetLeft + 'px'
                productChoiceCategoryUnderline.style.width = choice.offsetWidth + 'px'
            }
        })
    })
}

window.addEventListener('resize', () => {
    setActiveItemCategoryProduct()
})

function renderingProductChoiceCategorySubmenu(choice, productCategoryContainer) {
    switch (choice.dataset.choiceProductCategory) {
        case 'Пицца': {
            const productCategorySelectSubmenuWrapper = document.createElement('div')
            productCategorySelectSubmenuWrapper.classList.add('main__section__menu-select-submenu')
            productCategorySelectSubmenuWrapper.innerHTML = 
            `<ul>
                <li><button type="button" class="main__section__menu-choice-category-list-item-submenu main__section__menu-choice-category-list-item-submenu-hover" data-choice-product-category-submenu="Фирменная пицца">Фирменная пицца</button></li>
                <li><button type="button" class="main__section__menu-choice-category-list-item-submenu main__section__menu-choice-category-list-item-submenu-hover" data-choice-product-category-submenu="Традиционная пицца">Традиционная пицца</button></li>
            </ul>`
    
            productCategoryContainer.appendChild(productCategorySelectSubmenuWrapper)
            productChoiceCategorySubmenuSelect()
            break
        }
        default: {
            Array.from(productCategoryContainer.children).forEach((el) => {
                if (el.classList.contains('main__section__menu-select-submenu')) {
                    el.remove()
                }
            })
        }
    }
}

function productChoiceCategorySubmenuSelect() {
    const productChoiceCategorySubmenuSelectButtonArray = Array.from(document.querySelectorAll('[data-choice-product-category-submenu]'))
    const productMenuContainer = document.querySelector('#products-menu-container')

    productChoiceCategorySubmenuSelectButtonArray.forEach((btn) => btn.addEventListener('click', () => {
        if (!btn.classList.contains('main__section__menu-choice-category-list-item-submenu--active')) {
            productChoiceCategorySubmenuSelectButtonArray.forEach((btn) => btn.classList.remove('main__section__menu-choice-category-list-item-submenu--active') )
            btn.classList.add('main__section__menu-choice-category-list-item-submenu--active')

            productMenuContainer.innerHTML = ''
            getDataProductsForMenu(undefined, viewFilter = btn.dataset.choiceProductCategorySubmenu)
        } else if (btn.classList.contains('main__section__menu-choice-category-list-item-submenu--active')) {
            btn.classList.remove('main__section__menu-choice-category-list-item-submenu--active')
            btn.classList.remove('main__section__menu-choice-category-list-item-submenu-hover')

            btn.addEventListener('mouseleave', () => {
                btn.classList.add('main__section__menu-choice-category-list-item-submenu-hover')
            })

            productMenuContainer.innerHTML = ''
            getDataProductsForMenu()
        }
    }))
}

function getDataProductsForMenu(categoryFind, viewFilter) {
    const currentActiveCategoryFind = categoryFind !== undefined ? categoryFind : document.querySelector('.main__section__menu-choice-category-list-item--active').innerHTML
    const currentViewFilter = viewFilter !== undefined ? viewFilter : ''

    document.body.insertAdjacentHTML('beforeend', '<img class="loadeg-content-gif" src="/img/load-content.gif" alt="load-content">')

    fetch(`/getDataProducts?categoryFind=${currentActiveCategoryFind}&viewFilter=${currentViewFilter}`)
    .then(response => response.json())
    .then(data => (fillDataProducts(data, document.querySelector('#products-menu-container')), document.querySelector('.loadeg-content-gif').remove()))
    .catch(err => (console.log(err), document.querySelector('.loadeg-content-gif').remove()))
}