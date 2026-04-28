// =============================================
// SUPERMERCADO V2 - MÓDULO COMPLETO
// By NelSystems - Integrado con Mi Economía
// =============================================

const SupermarketV2 = {
    version: '3.5.9',
    currentListId: null,
    currentView: 'dashboard',
    monthlyBudget: 0,
    storeChart: null, // Almacenar instancia del gráfico
    
    // Lista Maestra de 80+ Productos Predefinidos
    DEFAULT_PRODUCTS: [
        { name: "Arroz", quantity: 8, unit: "kg", category: "grains" },
        { name: "Frijoles", quantity: 4, unit: "paquete", category: "grains" },
        { name: "Azúcar moreno", quantity: 4, unit: "paquete", category: "grains" },
        { name: "Sal Marina", quantity: 1, unit: "paquete", category: "grains" },
        { name: "Aceite girasol", quantity: 1, unit: "lt", category: "oils" },
        { name: "Aceite de coco", quantity: 1, unit: "unidad", category: "oils" },
        { name: "Mantequilla en barra", quantity: 1, unit: "caja", category: "dairy" },
        { name: "Pan cuadrado", quantity: 4, unit: "paquete", category: "bakery" },
        { name: "Salsa de tomate", quantity: 2, unit: "unidad", category: "sauces" },
        { name: "Harina", quantity: 1, unit: "unidad", category: "bakery" },
        { name: "Leche Semidescremada", quantity: 24, unit: "lt", category: "dairy" },
        { name: "Leche Deslactosada", quantity: 5, unit: "lt", category: "dairy" },
        { name: "Yogurt", quantity: 4, unit: "unidad", category: "dairy" },
        { name: "Queso", quantity: 1, unit: "unidad", category: "dairy" },
        { name: "Margarina", quantity: 1, unit: "unidad", category: "dairy" },
        { name: "Huevos", quantity: 1, unit: "caja", category: "dairy" },
        { name: "Café", quantity: 0.5, unit: "kg", category: "beverages" },
        { name: "Té", quantity: 1, unit: "caja", category: "beverages" },
        { name: "Jugo de naranja", quantity: 2, unit: "lt", category: "beverages" },
        { name: "Refresco", quantity: 2, unit: "lt", category: "beverages" },
        { name: "Atún", quantity: 6, unit: "unidad", category: "canned" },
        { name: "Maíz dulce", quantity: 4, unit: "unidad", category: "canned" },
        { name: "Frijoles molidos", quantity: 2, unit: "paquete", category: "canned" },
        { name: "Avena", quantity: 1, unit: "kg", category: "cereals" },
        { name: "Cereal", quantity: 3, unit: "caja", category: "cereals" },
        { name: "Galletas Soda", quantity: 6, unit: "paquete", category: "snacks" },
        { name: "Galleta dulce", quantity: 10, unit: "paquete", category: "snacks" },
        { name: "Spaguetti", quantity: 4, unit: "paquete", category: "pasta" },
        { name: "Pasta", quantity: 2, unit: "paquete", category: "pasta" },
        { name: "Papel higiénico", quantity: 12, unit: "unidad", category: "cleaning" },
        { name: "Papel toalla", quantity: 2, unit: "unidad", category: "cleaning" },
        { name: "Lavaplatos", quantity: 2, unit: "unidad", category: "cleaning" },
        { name: "Cloro", quantity: 2, unit: "unidad", category: "cleaning" },
        { name: "Detergente", quantity: 1, unit: "unidad", category: "cleaning" },
        { name: "Jabón líquido", quantity: 1, unit: "unidad", category: "personal" },
        { name: "Shampoo", quantity: 1, unit: "unidad", category: "personal" },
        { name: "Crema dental", quantity: 1, unit: "unidad", category: "personal" },
        { name: "Desodorante", quantity: 2, unit: "unidad", category: "personal" },
        { name: "Jabón de baño", quantity: 8, unit: "unidad", category: "personal" },
        { name: "Papas", quantity: 4, unit: "kg", category: "vegetables" },
        { name: "Zanahoria", quantity: 1, unit: "kg", category: "vegetables" },
        { name: "Tomate", quantity: 3, unit: "kg", category: "vegetables" },
        { name: "Cebolla", quantity: 1, unit: "kg", category: "vegetables" },
        { name: "Chile dulce", quantity: 1, unit: "kg", category: "vegetables" },
        { name: "Culantro", quantity: 4, unit: "paquete", category: "vegetables" },
        { name: "Apio", quantity: 2, unit: "unidad", category: "vegetables" },
        { name: "Yuca", quantity: 1, unit: "kg", category: "vegetables" },
        { name: "Plátano maduro", quantity: 8, unit: "unidad", category: "vegetables" },
        { name: "Limón", quantity: 24, unit: "unidad", category: "fruits" },
        { name: "Manzanas", quantity: 4, unit: "paquete", category: "fruits" },
        { name: "Naranjas", quantity: 2, unit: "paquete", category: "fruits" },
        { name: "Bananos", quantity: 4, unit: "unidad", category: "fruits" },
        { name: "Papaya", quantity: 2, unit: "unidad", category: "fruits" },
        { name: "Piña", quantity: 4, unit: "unidad", category: "fruits" },
        { name: "Peras", quantity: 8, unit: "unidad", category: "fruits" },
        { name: "Uvas", quantity: 2, unit: "caja", category: "fruits" },
        { name: "Fresa", quantity: 2, unit: "caja", category: "fruits" },
        { name: "Pollo", quantity: 2, unit: "kg", category: "meat" },
        { name: "Carne molida", quantity: 1, unit: "kg", category: "meat" },
        { name: "Bistec", quantity: 1, unit: "kg", category: "meat" },
        { name: "Chuletas", quantity: 1, unit: "kg", category: "meat" },
        { name: "Mortadela", quantity: 2, unit: "unidad", category: "meat" }
    ],

    async init() {
        await this.loadData();
        await this.initializeDefaultData();
        this.setupEventListeners();
        this.showView('dashboard');
    },

    async initializeDefaultData() {
        // Verificar si ya hay productos maestros
        const existing = await DB.getAll('masterProducts');
        
        if (existing.length === 0) {
            // Pre-poblar con productos por defecto
            for (const product of this.DEFAULT_PRODUCTS) {
                await DB.add('masterProducts', {
                    name: product.name,
                    defaultQuantity: product.quantity,
                    unit: product.unit,
                    category: product.category,
                    lastPrice: 0,
                    lastStore: '',
                    favorite: false,
                    frequency: 0
                });
            }
        }

        // Verificar tiendas por defecto
        const stores = await DB.getAll('stores');
        if (stores.length === 0) {
            const defaultStores = [
                { name: "AutoMercado", location: "Escazú", favorite: true },
                { name: "Walmart", location: "Centro", favorite: false },
                { name: "Mas x Menos", location: "Local", favorite: false },
                { name: "Fresh Market", location: "Plaza", favorite: false },
                { name: "Palí", location: "Local", favorite: false },
                { name: "Maxi Palí", location: "Centro", favorite: false },
                { name: "Mini Super", location: "Barrio", favorite: false },
                { name: "Chino", location: "Esquina", favorite: false }
            ];
            
            for (const store of defaultStores) {
                await DB.add('stores', store);
            }
        }

        // Cargar presupuesto mensual
        const budget = await DB.getSetting('monthlyGroceryBudget');
        this.monthlyBudget = budget ? budget.value : 0;
    },

    setupEventListeners() {
        // Botones principales
        document.getElementById('btnSuperDashboard')?.addEventListener('click', () => this.showView('dashboard'));
        document.getElementById('btnNewShoppingList')?.addEventListener('click', () => this.showView('newlist'));
        document.getElementById('btnMasterCatalog')?.addEventListener('click', () => this.showView('catalog'));
        document.getElementById('btnStores')?.addEventListener('click', () => this.showView('stores'));
        document.getElementById('btnShoppingHistory')?.addEventListener('click', () => this.showView('history'));
        
        // Formularios
        document.getElementById('formAddMasterProduct')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMasterProduct();
        });
        
        document.getElementById('formNewShoppingList')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createShoppingList();
        });

        // Búsqueda en catálogo
        document.getElementById('searchMasterProducts')?.addEventListener('input', (e) => {
            this.filterMasterProducts(e.target.value);
        });

        // Búsqueda de productos para agregar a lista
        document.getElementById('searchProductToAdd')?.addEventListener('input', (e) => {
            this.searchProductsToAdd(e.target.value);
        });
    },

    async loadData() {
        // Cargar datos necesarios
    },

    showView(viewName) {
        this.currentView = viewName;
        
        // Ocultar todas las sub-secciones
        document.querySelectorAll('.super-section').forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar la vista seleccionada
        const viewElement = document.getElementById(`super-${viewName}`);
        if (viewElement) {
            viewElement.style.display = 'block';
        }

        // Cargar datos de la vista
        switch(viewName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'catalog':
                this.loadMasterCatalog();
                break;
            case 'newlist':
                this.initNewList();
                break;
            case 'stores':
                this.loadStores();
                break;
            case 'history':
                this.loadHistory();
                break;
        }
    },

    async loadDashboard() {
        // Calcular estadísticas del mes
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Obtener compras completadas del mes
        const allLists = await DB.getAll('shoppingLists');
        const monthLists = allLists.filter(list => {
            if (!list.completed) return false;
            const listDate = new Date(list.completedDate);
            return listDate >= startOfMonth && listDate <= endOfMonth;
        });

        const totalSpent = monthLists.reduce((sum, list) => sum + (list.totalActual || 0), 0);
        const remaining = this.monthlyBudget - totalSpent;
        const savingsPercent = this.monthlyBudget > 0 ? ((remaining / this.monthlyBudget) * 100) : 0;

        // Actualizar KPIs
        document.getElementById('superBudget').textContent = App.formatCurrency(this.monthlyBudget);
        document.getElementById('superSpent').textContent = App.formatCurrency(totalSpent);
        document.getElementById('superRemaining').textContent = App.formatCurrency(remaining);
        document.getElementById('superSavings').textContent = `${savingsPercent.toFixed(1)}%`;

        // Listas activas
        const activeLists = allLists.filter(l => !l.completed);
        this.renderActiveLists(activeLists);

        // Productos frecuentes
        await this.loadFrequentProducts();

        // Gráficos
        await this.renderStoreChart(monthLists);
    },

    async renderActiveLists(lists) {
        const container = document.getElementById('activeListsContainer');
        if (!container) return;

        if (lists.length === 0) {
            container.innerHTML = '<p class="empty-state-text">No hay listas activas. <a href="#" onclick="SupermarketV2.showView(\'newlist\'); return false;">Crear una</a></p>';
            return;
        }

        container.innerHTML = lists.map(list => `
            <div class="shopping-list-card">
                <div class="list-header">
                    <h4>${list.name}</h4>
                    <span class="list-date">${App.formatDate(list.date)}</span>
                </div>
                <p class="list-store">🏪 ${list.storeName || 'Sin tienda'}</p>
                <p class="list-items">📦 ${list.itemCount || 0} productos</p>
                <p class="list-total">💰 ${App.formatCurrency(list.totalEstimated || 0)}</p>
                <div class="list-actions">
                    <button class="btn btn-sm btn-secondary" onclick="SupermarketV2.continueList(${list.id})" title="Editar">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="SupermarketV2.enterShoppingMode(${list.id})" title="Modo Compras">
                        🛒 Comprar
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="SupermarketV2.duplicateList(${list.id})" title="Duplicar">
                        📋
                    </button>
                    <button class="btn btn-sm btn-accent" onclick="SupermarketV2.finishShoppingFromDashboard(${list.id})" title="Finalizar">
                        ✅
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="SupermarketV2.deleteList(${list.id})" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },

    async finishShoppingFromDashboard(listId) {
        this.currentListId = listId;
        await this.finishShopping();
    },

    async loadFrequentProducts() {
        const products = await DB.getAll('masterProducts');
        const frequent = products
            .filter(p => p.frequency > 0)
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);

        const container = document.getElementById('frequentProductsContainer');
        if (!container) return;

        if (frequent.length === 0) {
            container.innerHTML = '<p class="empty-state-text">Aún no tienes productos frecuentes</p>';
            return;
        }

        container.innerHTML = frequent.map(p => `
            <div class="frequent-product-item">
                <span>${p.name}</span>
                <small>Comprado ${p.frequency} veces</small>
                <button class="btn btn-sm btn-primary" onclick="SupermarketV2.quickAddProduct(${p.id})">
                    ➕
                </button>
            </div>
        `).join('');
    },

    async loadMasterCatalog() {
        const products = await DB.getAll('masterProducts');
        this.renderMasterProducts(products);
    },

    renderMasterProducts(products) {
        const container = document.getElementById('masterProductsList');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="empty-state-text">No hay productos en el catálogo</p>';
            return;
        }

        // Agrupar por categoría
        const grouped = {};
        products.forEach(p => {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push(p);
        });

        container.innerHTML = Object.entries(grouped).map(([category, prods]) => `
            <div class="category-group">
                <h3>${this.getCategoryLabel(category)}</h3>
                <div class="products-grid">
                    ${prods.map(p => `
                        <div class="master-product-card">
                            <div class="product-header">
                                <strong>${p.name}</strong>
                                ${p.favorite ? '<span>⭐</span>' : ''}
                            </div>
                            <p>${p.defaultQuantity} ${p.unit}</p>
                            ${p.lastPrice > 0 ? `<p class="product-price">Último: ${App.formatCurrency(p.lastPrice)}</p>` : ''}
                            <div class="product-actions">
                                <button class="btn btn-sm btn-primary" onclick="SupermarketV2.toggleFavorite(${p.id})">
                                    ${p.favorite ? '⭐' : '☆'}
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="SupermarketV2.editMasterProduct(${p.id})">
                                    ✏️
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="SupermarketV2.deleteMasterProduct(${p.id})">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    filterMasterProducts(query) {
        if (!query) {
            this.loadMasterCatalog();
            return;
        }

        DB.getAll('masterProducts').then(products => {
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase())
            );
            this.renderMasterProducts(filtered);
        });
    },

    async addMasterProduct() {
        const name = document.getElementById('masterProductName').value;
        const quantity = parseFloat(document.getElementById('masterProductQuantity').value) || 1;
        const unit = document.getElementById('masterProductUnit').value;
        const category = document.getElementById('masterProductCategory').value;

        if (!name) {
            alert('El nombre es requerido');
            return;
        }

        await DB.add('masterProducts', {
            name,
            defaultQuantity: quantity,
            unit,
            category,
            lastPrice: 0,
            lastStore: '',
            favorite: false,
            frequency: 0
        });

        // Limpiar formulario
        document.getElementById('formAddMasterProduct').reset();
        
        // Recargar catálogo
        await this.loadMasterCatalog();
        
        this.showSuccess('Producto agregado al catálogo');
    },

    async toggleFavorite(productId) {
        const product = await DB.get('masterProducts', productId);
        product.favorite = !product.favorite;
        await DB.update('masterProducts', product);
        await this.loadMasterCatalog();
    },

    async deleteMasterProduct(productId) {
        if (!confirm('¿Eliminar este producto del catálogo?')) return;
        await DB.delete('masterProducts', productId);
        await this.loadMasterCatalog();
        this.showSuccess('Producto eliminado');
    },

    async initNewList() {
        // Cargar tiendas
        const stores = await DB.getAll('stores');
        const storeSelect = document.getElementById('newListStore');
        if (storeSelect) {
            storeSelect.innerHTML = '<option value="">Seleccionar tienda...</option>' +
                stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }

        // Limpiar lista actual
        this.currentListId = null;
        const productsContainer = document.getElementById('currentListProducts');
        const totalContainer = document.getElementById('listTotalEstimated');
        const addSection = document.getElementById('addProductsSection');
        
        if (productsContainer) productsContainer.innerHTML = '';
        if (totalContainer) totalContainer.textContent = '₡0.00';
        if (addSection) addSection.style.display = 'none';
        
        // Limpiar formulario
        document.getElementById('newListName').value = '';
        document.getElementById('newListStore').value = '';
    },

    async createShoppingList() {
        const name = document.getElementById('newListName').value.trim();
        const storeId = parseInt(document.getElementById('newListStore').value);

        if (!name || !storeId) {
            this.showError('Completa el nombre y la tienda');
            return;
        }

        const store = await DB.get('stores', storeId);

        const listId = await DB.add('shoppingLists', {
            name,
            storeId,
            storeName: store.name,
            date: new Date().toISOString().split('T')[0],
            completed: false,
            totalEstimated: 0,
            totalActual: 0,
            itemCount: 0
        });

        this.currentListId = listId;
        this.showSuccess('Lista creada - Agrega productos');
        
        // Mostrar sección de agregar productos
        document.getElementById('addProductsSection').style.display = 'block';
        document.getElementById('listNameDisplay').textContent = name;
        document.getElementById('listStoreDisplay').textContent = store.name;
        
        await this.renderListProducts();
    },

    async createEmptyList() {
        await this.createShoppingList();
    },

    async createListWithProducts() {
        const name = document.getElementById('newListName').value.trim();
        const storeId = parseInt(document.getElementById('newListStore').value);

        if (!name || !storeId) {
            this.showError('Completa el nombre y la tienda primero');
            return;
        }

        // Crear la lista primero
        await this.createShoppingList();
        
        // Mostrar modal de pre-carga
        await this.showPreloadModal();
    },

    async showPreloadModal() {
        const modal = document.getElementById('preloadProductsModal');
        if (!modal) {
            this.showError('Modal no disponible');
            return;
        }

        const products = await DB.getAll('masterProducts');
        const grouped = {};
        
        products.forEach(p => {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push(p);
        });

        const container = document.getElementById('preloadProductsList');
        container.innerHTML = Object.entries(grouped).map(([category, prods]) => `
            <div class="preload-category">
                <div class="category-header">
                    <input type="checkbox" id="cat-${category}" onchange="SupermarketV2.toggleCategory('${category}', this.checked)">
                    <label for="cat-${category}">
                        ${this.getCategoryLabel(category)}
                        <span>(${prods.length} productos)</span>
                    </label>
                </div>
                <div class="category-products" id="products-${category}">
                    ${prods.map(p => `
                        <label class="preload-product-item" for="prod-${p.id}">
                            <input type="checkbox" class="product-check cat-${category}" data-product-id="${p.id}" id="prod-${p.id}" onchange="SupermarketV2.updatePreloadCounter()">
                            <div style="flex: 1; min-width: 0;">
                                <strong>${p.name}</strong>
                                <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem;">
                                    <input type="number" class="qty-input" id="qty-${p.id}" value="${p.defaultQuantity}" min="0.1" step="0.1" style="width: 60px; padding: 0.25rem;">
                                    <small>${p.unit}</small>
                                </div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        modal.style.cssText = 'display: flex !important; z-index: 2147483647 !important;';
        modal.setAttribute('style', 'display: flex !important; z-index: 2147483647 !important;');
        modal.classList.add('modal-visible');
        setTimeout(() => modal.scrollTop = 0, 10);
        this.updatePreloadCounter();
    },

    closePreloadModal() {
        const modal = document.getElementById('preloadProductsModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('modal-visible');
        }
    },

    toggleCategory(category, checked) {
        const checkboxes = document.querySelectorAll(`.cat-${category}`);
        checkboxes.forEach(cb => cb.checked = checked);
        this.updatePreloadCounter();
    },

    selectAllProducts() {
        document.querySelectorAll('.product-check').forEach(cb => cb.checked = true);
        document.querySelectorAll('.category-header input').forEach(cb => cb.checked = true);
        this.updatePreloadCounter();
    },

    selectFrequentProducts() {
        // Deseleccionar todos primero
        document.querySelectorAll('.product-check').forEach(cb => cb.checked = false);
        document.querySelectorAll('.category-header input').forEach(cb => cb.checked = false);
        
        // Seleccionar solo frecuentes
        DB.getAll('masterProducts').then(products => {
            const frequent = products
                .filter(p => p.frequency > 0)
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 20);
            
            frequent.forEach(p => {
                const checkbox = document.getElementById(`prod-${p.id}`);
                if (checkbox) checkbox.checked = true;
            });
            
            this.updatePreloadCounter();
        });
    },

    updatePreloadCounter() {
        const checked = document.querySelectorAll('.product-check:checked').length;
        const counter = document.getElementById('preloadCounter');
        if (counter) counter.textContent = `${checked} seleccionados`;
    },

    async confirmPreload() {
        if (!this.currentListId) {
            this.showError('Primero crea una lista');
            return;
        }

        const selectedCheckboxes = document.querySelectorAll('.product-check:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.productId));

        if (selectedIds.length === 0) {
            this.showError('Selecciona al menos un producto');
            return;
        }

        for (const productId of selectedIds) {
            const product = await DB.get('masterProducts', productId);
            const qtyInput = document.getElementById(`qty-${productId}`);
            const customQty = qtyInput ? parseFloat(qtyInput.value) : product.defaultQuantity;
            
            await DB.add('shoppingProducts', {
                listId: this.currentListId,
                productId: product.id,
                name: product.name,
                quantity: customQty,
                unit: product.unit,
                estimatedPrice: product.lastPrice || 0,
                actualPrice: 0,
                checked: false
            });
        }

        this.closePreloadModal();
        await this.updateListTotal();
        await this.renderListProducts();
        this.showSuccess(`${selectedIds.length} productos agregados`);
    },

    closePreloadModal() {
        const modal = document.getElementById('preloadProductsModal');
        if (modal) modal.style.display = 'none';
    },

    async editList(listId) {
        this.currentListId = listId;
        const list = await DB.get('shoppingLists', listId);
        
        // Cambiar a vista de edición
        this.showView('newlist');
        
        // Llenar datos de la lista
        document.getElementById('newListName').value = list.name;
        document.getElementById('newListStore').value = list.storeId;
        document.getElementById('listNameDisplay').textContent = list.name;
        document.getElementById('listStoreDisplay').textContent = list.storeName;
        
        // Mostrar productos
        document.getElementById('addProductsSection').style.display = 'block';
        await this.renderListProducts();
    },

    async saveList() {
        if (!this.currentListId) {
            this.showError('No hay lista para guardar');
            return;
        }

        const list = await DB.get('shoppingLists', this.currentListId);
        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);
        
        // Actualizar totales
        const total = listProducts.reduce((sum, p) => {
            const price = p.actualPrice || p.estimatedPrice || 0;
            return sum + (price * p.quantity);
        }, 0);

        list.totalEstimated = total;
        list.itemCount = listProducts.length;
        await DB.update('shoppingLists', list);

        this.showSuccess('Lista guardada');
        this.showView('dashboard');
    },

    async deleteList(listId) {
        if (!confirm('¿Eliminar esta lista y todos sus productos?')) return;

        // Eliminar productos de la lista
        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === listId);
        
        for (const product of listProducts) {
            await DB.delete('shoppingProducts', product.id);
        }

        // Eliminar la lista
        await DB.delete('shoppingLists', listId);

        this.showSuccess('Lista eliminada');
        await this.loadDashboard();
    },

    async continueList(listId) {
        await this.editList(listId);
    },

    async duplicateList(listId) {
        const originalList = await DB.get('shoppingLists', listId);
        const products = await DB.getAll('shoppingProducts');
        const originalProducts = products.filter(p => p.listId === listId);

        const newListId = await DB.add('shoppingLists', {
            name: `${originalList.name} (Copia)`,
            storeId: originalList.storeId,
            storeName: originalList.storeName,
            date: new Date().toISOString().split('T')[0],
            completed: false,
            totalEstimated: 0,
            totalActual: 0,
            itemCount: 0
        });

        for (const product of originalProducts) {
            await DB.add('shoppingProducts', {
                listId: newListId,
                productId: product.productId,
                name: product.name,
                quantity: product.quantity,
                unit: product.unit,
                estimatedPrice: product.estimatedPrice,
                actualPrice: 0,
                checked: false
            });
        }

        this.showSuccess('Lista duplicada');
        await this.editList(newListId);
    },

    async enterShoppingMode(listId) {
        this.currentListId = listId;
        const list = await DB.get('shoppingLists', listId);
        
        this.showView('shopping');
        
        // Esperar a que el DOM se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const nameElement = document.getElementById('shoppingListName');
        const storeElement = document.getElementById('shoppingStoreName');
        
        if (nameElement) nameElement.textContent = list.name;
        if (storeElement) storeElement.textContent = list.storeName;
        
        await this.renderShoppingMode();
    },

    async renderShoppingMode() {
        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);
        
        const pending = listProducts.filter(p => !p.checked);
        const checked = listProducts.filter(p => p.checked);
        const total = listProducts.length;
        
        const pendingContainer = document.getElementById('pendingProducts');
        const checkedContainer = document.getElementById('checkedProducts');
        
        pendingContainer.innerHTML = pending.map(p => `
            <div class="shopping-product-item" data-product-id="${p.id}">
                <input type="checkbox" class="product-checkbox" data-product-id="${p.id}">
                <label for="check-${p.id}">
                    <strong>${p.name}</strong>
                    <small>${p.quantity} ${p.unit}</small>
                </label>
                <input type="number" class="price-input" data-product-id="${p.id}" placeholder="Precio" value="${p.actualPrice || ''}" style="width: 80px;">
            </div>
        `).join('') || '<p class="empty-state-text">✅ ¡Todos los productos comprados!</p>';
        
        // Agregar event listeners después de renderizar
        const checkboxes = document.querySelectorAll('.product-checkbox');
        console.log('📌 Agregando event listeners a', checkboxes.length, 'checkboxes');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                console.log('🔘 Checkbox clickeado!', e.target.dataset.productId);
                const productId = parseInt(e.target.dataset.productId);
                console.log('⏳ Llamando a toggleProductCheck con ID:', productId);
                try {
                    await this.toggleProductCheck(productId);
                    console.log('✅ toggleProductCheck completado');
                } catch (error) {
                    console.error('❌ Error en toggleProductCheck:', error);
                    console.error('Stack:', error.stack);
                }
            });
        });
        console.log('✅ Event listeners agregados a checkboxes');
        
        document.querySelectorAll('.price-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.updateProductPrice(productId, e.target.value);
            });
        });
        
        checkedContainer.innerHTML = checked.map(p => `
            <div class="shopping-product-item checked-item">
                <input type="checkbox" checked disabled>
                <label style="text-decoration: line-through; opacity: 0.6;">
                    <strong>${p.name}</strong>
                    <small>${p.quantity} ${p.unit}</small>
                </label>
                <button class="btn-icon undo-btn" data-product-id="${p.id}" title="Desmarcar">↩️</button>
            </div>
        `).join('') || '<p class="empty-state-text">Ningún producto comprado aún</p>';
        
        // Event listeners para botones de undo
        document.querySelectorAll('.undo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.uncheckProduct(productId);
            });
        });
        
        const counterElement = document.getElementById('pendingCount');
        if (counterElement) {
            counterElement.textContent = `${checked.length} de ${total}`;
        }
    },

    async toggleProductCheck(productId) {
        console.log('🔄 Marcando producto:', productId);
        try {
            const product = await DB.get('shoppingProducts', productId);
            console.log('📦 Producto antes:', product.checked);
            product.checked = !product.checked;
            product.checkedAt = new Date().toISOString();
            await DB.update('shoppingProducts', product);
            console.log('✅ Producto después:', product.checked);
            
            // Re-renderizar inmediatamente
            console.log('🎨 Re-renderizando...');
            await this.renderShoppingMode();
            console.log('✅ Render completo');
        } catch (error) {
            console.error('❌ ERROR CRÍTICO en toggleProductCheck:', error);
            console.error('Stack:', error.stack);
            throw error; // Re-lanzar para que se vea en consola
        }
    },

    async uncheckProduct(productId) {
        const choice = confirm('¿Qué deseas hacer?\n\nOK = Comprar nuevamente (+1)\nCancelar = Fue un error');
        const product = await DB.get('shoppingProducts', productId);
        
        if (choice) {
            product.quantity += 1;
        }
        
        product.checked = false;
        await DB.update('shoppingProducts', product);
        await this.renderShoppingMode();
    },

    async updateProductPrice(productId, price) {
        const product = await DB.get('shoppingProducts', productId);
        product.actualPrice = parseFloat(price) || 0;
        await DB.update('shoppingProducts', product);
    },

    async searchInShopping() {
        const query = document.getElementById('shoppingSearch').value.trim().toLowerCase();
        if (!query) return;
        
        const allProducts = await DB.getAll('masterProducts');
        const listProducts = await DB.getAll('shoppingProducts');
        const currentList = listProducts.filter(p => p.listId === this.currentListId);
        
        const results = allProducts.filter(p => p.name.toLowerCase().includes(query));
        const container = document.getElementById('searchResults');
        
        container.innerHTML = results.map(p => {
            const inList = currentList.find(lp => lp.productId === p.id);
            return `
                <div class="search-result-item">
                    <span><strong>${p.name}</strong> <small>${p.defaultQuantity} ${p.unit}</small></span>
                    ${inList ? 
                        `<button class="btn btn-sm btn-primary mark-checked-btn" data-product-id="${inList.id}">✓ Marcar Comprado</button>` :
                        `<button class="btn btn-sm btn-secondary add-search-btn" data-product-id="${p.id}">+ Agregar</button>`
                    }
                </div>
            `;
        }).join('') || '<p>No se encontraron resultados</p>';
        
        // Event listeners para botones de búsqueda
        document.querySelectorAll('.mark-checked-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.markAsChecked(productId);
            });
        });
        
        document.querySelectorAll('.add-search-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.addFromSearch(productId);
            });
        });
    },

    async addFromSearch(productId) {
        const product = await DB.get('masterProducts', productId);
        await DB.add('shoppingProducts', {
            listId: this.currentListId,
            productId: product.id,
            name: product.name,
            quantity: product.defaultQuantity,
            unit: product.unit,
            estimatedPrice: product.lastPrice || 0,
            actualPrice: 0,
            checked: false
        });
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('shoppingSearch').value = '';
        await this.renderShoppingMode();
        this.showSuccess(`${product.name} agregado`);
    },

    async markAsChecked(productId) {
        await this.toggleProductCheck(productId);
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('shoppingSearch').value = '';
    },

    async finishShoppingWithTotal() {
        const manualTotal = parseFloat(document.getElementById('manualTotal').value);
        
        if (manualTotal && manualTotal > 0) {
            const list = await DB.get('shoppingLists', this.currentListId);
            list.completed = true;
            list.completedDate = new Date().toISOString().split('T')[0];
            list.totalActual = manualTotal;
            list.totalManual = manualTotal;
            await DB.update('shoppingLists', list);
            
            await DB.add('expenses', {
                description: `Compra: ${list.name}`,
                amount: manualTotal,
                category: 'groceries',
                date: list.completedDate,
                metadata: { listId: list.id, storeName: list.storeName }
            });
            
            this.showSuccess('Compra finalizada con total general');
            this.showView('dashboard');
            await this.loadDashboard();
        } else {
            await this.finishShopping();
        }
    },

    async searchProductsToAdd(query) {
        if (!query || query.length < 2) {
            document.getElementById('productSearchResults').innerHTML = '';
            return;
        }

        const products = await DB.getAll('masterProducts');
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        const container = document.getElementById('productSearchResults');
        container.innerHTML = filtered.map(p => `
            <div class="search-result-item" onclick="SupermarketV2.addProductToList(${p.id})">
                <strong>${p.name}</strong>
                <span>${p.defaultQuantity} ${p.unit}</span>
                ${p.lastPrice > 0 ? `<span>${App.formatCurrency(p.lastPrice)}</span>` : ''}
            </div>
        `).join('');
    },

    async addProductToList(productId) {
        if (!this.currentListId) {
            alert('Primero crea una lista');
            return;
        }

        const product = await DB.get('masterProducts', productId);

        await DB.add('shoppingProducts', {
            listId: this.currentListId,
            productId: product.id,
            name: product.name,
            quantity: product.defaultQuantity,
            unit: product.unit,
            estimatedPrice: product.lastPrice || 0,
            actualPrice: 0,
            checked: false
        });

        await this.updateListTotal();
        await this.renderListProducts();
        
        // Limpiar búsqueda
        document.getElementById('searchProductToAdd').value = '';
        document.getElementById('productSearchResults').innerHTML = '';
    },

    async renderListProducts() {
        if (!this.currentListId) return;

        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);

        const container = document.getElementById('currentListProducts');
        container.innerHTML = listProducts.map(p => `
            <div class="list-product-item ${p.checked ? 'checked' : ''}">
                <input type="checkbox" 
                    ${p.checked ? 'checked' : ''}
                    onchange="SupermarketV2.toggleProductCheck(${p.id})">
                <div class="product-info">
                    <strong>${p.name}</strong>
                    <input type="number" 
                        value="${p.quantity}" 
                        style="width: 60px;"
                        onchange="SupermarketV2.updateProductQuantity(${p.id}, this.value)">
                    <span>${p.unit}</span>
                </div>
                <input type="number" 
                    placeholder="Precio"
                    value="${p.actualPrice || p.estimatedPrice || ''}"
                    style="width: 100px;"
                    onchange="SupermarketV2.updateProductPrice(${p.id}, this.value)">
                <button class="btn btn-sm btn-danger" onclick="SupermarketV2.removeProductFromList(${p.id})">
                    🗑️
                </button>
            </div>
        `).join('');
    },

    async updateProductQuantity(productId, quantity) {
        const product = await DB.get('shoppingProducts', productId);
        product.quantity = parseFloat(quantity);
        await DB.update('shoppingProducts', product);
        await this.updateListTotal();
    },

    async updateProductPrice(productId, price) {
        const product = await DB.get('shoppingProducts', productId);
        product.actualPrice = parseFloat(price) || 0;
        await DB.update('shoppingProducts', product);
        await this.updateListTotal();
    },

    async removeProductFromList(productId) {
        await DB.delete('shoppingProducts', productId);
        await this.renderListProducts();
        await this.updateListTotal();
    },

    async updateListTotal() {
        if (!this.currentListId) return;

        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);

        const total = listProducts.reduce((sum, p) => {
            const price = p.actualPrice || p.estimatedPrice || 0;
            return sum + (price * p.quantity);
        }, 0);

        document.getElementById('listTotalEstimated').textContent = App.formatCurrency(total);

        // Actualizar lista
        const list = await DB.get('shoppingLists', this.currentListId);
        list.totalEstimated = total;
        list.itemCount = listProducts.length;
        await DB.update('shoppingLists', list);
    },

    async finishShopping() {
        if (!this.currentListId) return;

        const list = await DB.get('shoppingLists', this.currentListId);
        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);

        // Calcular total real
        const totalActual = listProducts.reduce((sum, p) => {
            return sum + ((p.actualPrice || p.estimatedPrice || 0) * p.quantity);
        }, 0);

        if (totalActual === 0) {
            alert('Agrega precios a los productos antes de finalizar');
            return;
        }

        if (!confirm(`¿Finalizar compra por ${App.formatCurrency(totalActual)}?`)) return;

        // Marcar lista como completada
        list.completed = true;
        list.completedDate = new Date().toISOString().split('T')[0];
        list.totalActual = totalActual;
        await DB.update('shoppingLists', list);

        // Registrar en Gastos
        await DB.add('expenses', {
            description: `Supermercado - ${list.storeName}`,
            amount: totalActual,
            category: 'groceries',
            date: list.completedDate,
            metadata: {
                listId: list.id,
                storeName: list.storeName,
                itemCount: listProducts.length
            }
        });

        // Actualizar historial de precios y frecuencia de productos
        for (const item of listProducts) {
            if (item.actualPrice > 0) {
                // Guardar precio histórico
                await DB.add('priceHistory', {
                    productId: item.productId,
                    storeId: list.storeId,
                    price: item.actualPrice,
                    date: list.completedDate
                });

                // Actualizar producto maestro
                const masterProduct = await DB.get('masterProducts', item.productId);
                masterProduct.lastPrice = item.actualPrice;
                masterProduct.lastStore = list.storeName;
                masterProduct.frequency = (masterProduct.frequency || 0) + 1;
                await DB.update('masterProducts', masterProduct);
            }
        }

        // Actualizar dashboard principal
        await Dashboard.refresh();

        this.showSuccess('¡Compra finalizada y registrada en gastos!');
        this.currentListId = null;
        this.showView('dashboard');
    },

    async loadStores() {
        const stores = await DB.getAll('stores');
        const container = document.getElementById('storesList');
        
        if (!container) return;

        container.innerHTML = stores.map(s => `
            <div class="store-card">
                <h4>${s.name}</h4>
                <p>${s.location || 'Sin ubicación'}</p>
                ${s.favorite ? '<span>⭐ Favorita</span>' : ''}
                <div class="store-actions">
                    <button class="btn btn-sm btn-secondary" onclick="SupermarketV2.editStore(${s.id})">
                        ✏️
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="SupermarketV2.deleteStore(${s.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },

    async loadHistory() {
        const lists = await DB.getAll('shoppingLists');
        const completed = lists.filter(l => l.completed).sort((a, b) => 
            new Date(b.completedDate) - new Date(a.completedDate)
        );

        const container = document.getElementById('historyList');
        if (!container) return;

        if (completed.length === 0) {
            container.innerHTML = '<p class="empty-state-text">No hay compras completadas</p>';
            return;
        }

        container.innerHTML = completed.map(list => `
            <div class="history-item">
                <div class="history-header">
                    <h4>${list.name}</h4>
                    <span class="history-date">${App.formatDate(list.completedDate)}</span>
                </div>
                <p>🏪 ${list.storeName}</p>
                <p>📦 ${list.itemCount} productos</p>
                <p class="history-total">💰 ${App.formatCurrency(list.totalActual)}</p>
                <div class="list-actions">
                    <button class="btn btn-sm btn-secondary" onclick="SupermarketV2.viewListDetail(${list.id})">
                        👁️ Ver Detalle
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="SupermarketV2.duplicateList(${list.id})">
                        📋 Usar como Plantilla
                    </button>
                </div>
            </div>
        `).join('');
    },

    async viewListDetail(listId) {
        const list = await DB.get('shoppingLists', listId);
        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === listId);

        let detail = `📝 ${list.name}\n`;
        detail += `🏪 ${list.storeName}\n`;
        detail += `📅 ${App.formatDate(list.completedDate)}\n\n`;
        detail += `Productos (${listProducts.length}):\n`;
        detail += `${'─'.repeat(40)}\n`;
        
        listProducts.forEach(p => {
            const price = p.actualPrice || p.estimatedPrice || 0;
            detail += `• ${p.name} - ${p.quantity} ${p.unit}\n`;
            detail += `  ${App.formatCurrency(price)}\n`;
        });
        
        detail += `${'─'.repeat(40)}\n`;
        detail += `💰 Total: ${App.formatCurrency(list.totalActual)}`;

        alert(detail);
    },

    async renderStoreChart(lists) {
        const canvas = document.getElementById('storeExpensesChart');
        if (!canvas || typeof Chart === 'undefined' || !Chart) return;

        // Destruir gráfico anterior si existe
        if (this.storeChart) {
            this.storeChart.destroy();
            this.storeChart = null;
        }

        // Agrupar por tienda
        const storeData = {};
        lists.forEach(list => {
            const store = list.storeName || 'Sin tienda';
            storeData[store] = (storeData[store] || 0) + (list.totalActual || 0);
        });

        // Si no hay datos, no crear gráfico
        if (Object.keys(storeData).length === 0) {
            canvas.style.display = 'none';
            return;
        }

        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        
        this.storeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(storeData),
                datasets: [{
                    label: 'Gastado',
                    data: Object.values(storeData),
                    backgroundColor: '#00D976'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    },

    getCategoryLabel(category) {
        const labels = {
            grains: '🌾 Granos',
            dairy: '🥛 Lácteos',
            meat: '🥩 Carnes',
            fruits: '🍎 Frutas',
            vegetables: '🥬 Vegetales',
            bakery: '🍞 Panadería',
            beverages: '🥤 Bebidas',
            snacks: '🍪 Snacks',
            pasta: '🍝 Pastas',
            canned: '🥫 Enlatados',
            cereals: '🥣 Cereales',
            oils: '🫗 Aceites',
            sauces: '🍯 Salsas',
            cleaning: '🧹 Limpieza',
            personal: '🧴 Cuidado Personal'
        };
        return labels[category] || category;
    },

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'alert-item success';
        toast.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; min-width: 250px;';
        toast.innerHTML = `<strong>${message}</strong>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'alert-item danger';
        toast.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; min-width: 250px;';
        toast.innerHTML = `<strong>${message}</strong>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// Exponer globalmente para que funcione con onclick en HTML
window.SupermarketV2 = SupermarketV2;

// Log de versión para verificar que el archivo se cargó
console.log('🚀 SupermarketV2 cargado - Versión:', SupermarketV2.version);
console.log('✅ Event listeners disponibles');
