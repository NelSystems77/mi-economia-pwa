const DB = {
    name: 'MiEconomiaDB',
    version: 2,
    db: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('income')) {
                    const incomeStore = db.createObjectStore('income', { keyPath: 'id', autoIncrement: true });
                    incomeStore.createIndex('date', 'date', { unique: false });
                    incomeStore.createIndex('category', 'category', { unique: false });
                }

                if (!db.objectStoreNames.contains('expenses')) {
                    const expensesStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
                    expensesStore.createIndex('date', 'date', { unique: false });
                    expensesStore.createIndex('category', 'category', { unique: false });
                }

                if (!db.objectStoreNames.contains('obligations')) {
                    const obligationsStore = db.createObjectStore('obligations', { keyPath: 'id', autoIncrement: true });
                    obligationsStore.createIndex('dueDay', 'dueDay', { unique: false });
                }

                if (!db.objectStoreNames.contains('obligationPayments')) {
                    const paymentsStore = db.createObjectStore('obligationPayments', { keyPath: 'id', autoIncrement: true });
                    paymentsStore.createIndex('obligationId', 'obligationId', { unique: false });
                    paymentsStore.createIndex('date', 'date', { unique: false });
                }

                // Supermercado V2 - Tablas nuevas
                if (!db.objectStoreNames.contains('masterProducts')) {
                    const masterStore = db.createObjectStore('masterProducts', { keyPath: 'id', autoIncrement: true });
                    masterStore.createIndex('name', 'name', { unique: false });
                    masterStore.createIndex('category', 'category', { unique: false });
                    masterStore.createIndex('favorite', 'favorite', { unique: false });
                }

                if (!db.objectStoreNames.contains('stores')) {
                    const storesStore = db.createObjectStore('stores', { keyPath: 'id', autoIncrement: true });
                    storesStore.createIndex('name', 'name', { unique: false });
                }

                if (!db.objectStoreNames.contains('shoppingLists')) {
                    const listsStore = db.createObjectStore('shoppingLists', { keyPath: 'id', autoIncrement: true });
                    listsStore.createIndex('date', 'date', { unique: false });
                    listsStore.createIndex('completed', 'completed', { unique: false });
                }

                if (!db.objectStoreNames.contains('shoppingProducts')) {
                    const productsStore = db.createObjectStore('shoppingProducts', { keyPath: 'id', autoIncrement: true });
                    productsStore.createIndex('listId', 'listId', { unique: false });
                }

                if (!db.objectStoreNames.contains('priceHistory')) {
                    const priceStore = db.createObjectStore('priceHistory', { keyPath: 'id', autoIncrement: true });
                    priceStore.createIndex('productId', 'productId', { unique: false });
                    priceStore.createIndex('storeId', 'storeId', { unique: false });
                    priceStore.createIndex('date', 'date', { unique: false });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    },

    async add(storeName, data) {
        const userId = await this.getCurrentUserId();
        const dataWithUser = { ...data, userId, createdAt: new Date().toISOString() };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(dataWithUser);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getAll(storeName, indexName = null, value = null) {
        const userId = await this.getCurrentUserId();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = indexName && value 
                ? store.index(indexName).getAll(value)
                : store.getAll();
            
            request.onsuccess = () => {
                const results = request.result.filter(item => item.userId === userId);
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put({ ...data, updatedAt: new Date().toISOString() });
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async getCurrentUserId() {
        const settings = await this.getSetting('currentUser');
        if (!settings) {
            const userId = await this.createDefaultUser();
            return userId;
        }
        return settings.value;
    },

    async createDefaultUser() {
        const user = {
            name: 'Usuario Principal',
            email: '',
            createdAt: new Date().toISOString()
        };
        
        const userId = await new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(user);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        await this.setSetting('currentUser', userId);
        return userId;
    },

    async getSetting(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async setSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async getByDateRange(storeName, startDate, endDate) {
        const userId = await this.getCurrentUserId();
        const all = await this.getAll(storeName);
        
        return all.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && 
                   itemDate <= new Date(endDate) &&
                   item.userId === userId;
        });
    },

    async exportData() {
        const data = {};
        const stores = ['income', 'expenses', 'obligations', 'obligationPayments', 'shoppingLists', 'shoppingProducts'];
        
        for (const store of stores) {
            data[store] = await this.getAll(store);
        }
        
        return data;
    },

    async importData(data) {
        for (const [storeName, items] of Object.entries(data)) {
            for (const item of items) {
                await this.add(storeName, item);
            }
        }
    }
};
