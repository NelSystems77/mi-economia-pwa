const Supermarket = {
    currentListId: null,

    async init() {
        this.setupEventListeners();
        await this.loadData();
    },

    setupEventListeners() {
        document.getElementById('btnNewList')?.addEventListener('click', () => this.createNewList());
        document.getElementById('btnAddProduct')?.addEventListener('click', () => this.showAddProductModal());
        document.getElementById('btnFinishShopping')?.addEventListener('click', () => this.finishShopping());
        
        const listSelector = document.getElementById('activeShoppingList');
        if (listSelector) {
            listSelector.addEventListener('change', (e) => {
                this.currentListId = parseInt(e.target.value);
                this.loadProducts();
            });
        }
    },

    async loadData() {
        await this.loadLists();
        if (this.currentListId) {
            await this.loadProducts();
        }
    },

    async loadLists() {
        const lists = await DB.getAll('shoppingLists');
        const selector = document.getElementById('activeShoppingList');
        if (!selector) return;

        const activeLists = lists.filter(l => !l.completed);

        selector.innerHTML = '<option value="">Seleccionar lista...</option>' +
            activeLists.map(list => `
                <option value="${list.id}" ${list.id === this.currentListId ? 'selected' : ''}>
                    ${list.name} - ${App.formatDate(list.date)}
                </option>
            `).join('');

        if (activeLists.length > 0 && !this.currentListId) {
            this.currentListId = activeLists[0].id;
            selector.value = this.currentListId;
            await this.loadProducts();
        }
    },

    async createNewList() {
        const name = prompt('Nombre de la lista:', `Lista ${new Date().toLocaleDateString()}`);
        if (!name) return;

        try {
            const listId = await DB.add('shoppingLists', {
                name: name,
                date: new Date().toISOString().split('T')[0],
                completed: false
            });

            this.currentListId = listId;
            await this.loadLists();
            this.showSuccess('Lista creada exitosamente');
        } catch (error) {
            this.showError('Error al crear la lista');
        }
    },

    showAddProductModal() {
        if (!this.currentListId) {
            this.showError('Selecciona o crea una lista primero');
            return;
        }

        App.showModal('Agregar Producto', `
            <form id="addProductForm">
                <div class="form-group">
                    <label>Nombre del producto</label>
                    <input type="text" id="productName" required>
                </div>
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" id="productQuantity" value="1" min="1" required>
                </div>
                <div class="form-group">
                    <label>Precio estimado</label>
                    <input type="number" id="productPrice" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <select id="productCategory">
                        <option value="fruits">Frutas y Verduras</option>
                        <option value="meat">Carnes</option>
                        <option value="dairy">Lácteos</option>
                        <option value="bakery">Panadería</option>
                        <option value="beverages">Bebidas</option>
                        <option value="snacks">Snacks</option>
                        <option value="cleaning">Limpieza</option>
                        <option value="personal">Cuidado Personal</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Agregar</button>
            </form>
        `);

        document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addProduct();
        });
    },

    async addProduct() {
        const product = {
            listId: this.currentListId,
            name: document.getElementById('productName').value,
            quantity: parseInt(document.getElementById('productQuantity').value),
            price: parseFloat(document.getElementById('productPrice').value) || 0,
            category: document.getElementById('productCategory').value,
            checked: false
        };

        try {
            await DB.add('shoppingProducts', product);
            await this.loadProducts();
            document.querySelector('.modal-overlay')?.remove();
            this.showSuccess('Producto agregado');
        } catch (error) {
            this.showError('Error al agregar el producto');
        }
    },

    async loadProducts() {
        if (!this.currentListId) {
            document.getElementById('productsList').innerHTML = 
                '<div class="empty-state-text">Selecciona una lista</div>';
            return;
        }

        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);

        const container = document.getElementById('productsList');
        if (!container) return;

        if (listProducts.length === 0) {
            container.innerHTML = '<div class="empty-state-text">No hay productos en esta lista</div>';
            return;
        }

        container.innerHTML = listProducts.map(product => `
            <div class="product-item ${product.checked ? 'checked' : ''}">
                <input type="checkbox" 
                    ${product.checked ? 'checked' : ''} 
                    onchange="Supermarket.toggleProduct(${product.id})">
                <div class="product-name">
                    ${product.name} (x${product.quantity})
                    <div style="font-size: 0.85rem; color: var(--text-light)">
                        ${this.getCategoryLabel(product.category)}
                    </div>
                </div>
                <div class="product-price">${App.formatCurrency(product.price * product.quantity)}</div>
                <button class="btn btn-sm btn-danger" onclick="Supermarket.deleteProduct(${product.id})">
                    🗑️
                </button>
            </div>
        `).join('');

        this.updateSummary(listProducts);
    },

    updateSummary(products) {
        const count = products.length;
        const total = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        document.getElementById('productCount').textContent = count;
        document.getElementById('estimatedTotal').textContent = App.formatCurrency(total);
    },

    async toggleProduct(productId) {
        const product = await DB.get('shoppingProducts', productId);
        if (!product) return;

        product.checked = !product.checked;
        await DB.update('shoppingProducts', product);
        await this.loadProducts();
    },

    async deleteProduct(productId) {
        if (!confirm('¿Eliminar este producto?')) return;

        try {
            await DB.delete('shoppingProducts', productId);
            await this.loadProducts();
            this.showSuccess('Producto eliminado');
        } catch (error) {
            this.showError('Error al eliminar el producto');
        }
    },

    async finishShopping() {
        if (!this.currentListId) {
            this.showError('No hay una lista activa');
            return;
        }

        const products = await DB.getAll('shoppingProducts');
        const listProducts = products.filter(p => p.listId === this.currentListId);
        const total = listProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        if (total === 0) {
            this.showError('Agrega precios a los productos primero');
            return;
        }

        if (!confirm(`¿Finalizar compra por un total de ${App.formatCurrency(total)}?`)) return;

        try {
            const list = await DB.get('shoppingLists', this.currentListId);
            list.completed = true;
            list.completedDate = new Date().toISOString().split('T')[0];
            list.total = total;
            await DB.update('shoppingLists', list);

            await DB.add('expenses', {
                description: `Supermercado - ${list.name}`,
                amount: total,
                category: 'groceries',
                date: new Date().toISOString().split('T')[0]
            });

            this.currentListId = null;
            await this.loadLists();
            await Dashboard.refresh();
            this.showSuccess('Compra finalizada y registrada en gastos');
        } catch (error) {
            this.showError('Error al finalizar la compra');
        }
    },

    getCategoryLabel(category) {
        const labels = {
            fruits: 'Frutas y Verduras',
            meat: 'Carnes',
            dairy: 'Lácteos',
            bakery: 'Panadería',
            beverages: 'Bebidas',
            snacks: 'Snacks',
            cleaning: 'Limpieza',
            personal: 'Cuidado Personal',
            other: 'Otro'
        };
        return labels[category] || category;
    },

    showSuccess(message) {
        this.showToast(message, 'success');
    },

    showError(message) {
        this.showToast(message, 'danger');
    },

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert-item ${type}`;
        toast.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; min-width: 250px;';
        toast.innerHTML = `<strong>${message}</strong>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};
