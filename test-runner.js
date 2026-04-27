// Test Runner para validar la app
const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, fn) {
    try {
        const result = fn();
        if (result) {
            tests.passed++;
            tests.results.push(`✅ ${name}`);
        } else {
            tests.failed++;
            tests.results.push(`❌ ${name}`);
        }
    } catch (e) {
        tests.failed++;
        tests.results.push(`❌ ${name}: ${e.message}`);
    }
}

// Cargar archivos
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/modules/supermarket-v2.js', 'utf8');

console.log('🧪 Ejecutando pruebas...\n');

// Test 1: HTML tiene elementos necesarios
test('HTML contiene #pendingCount', () => html.includes('id="pendingCount"'));
test('HTML contiene #pendingProducts', () => html.includes('id="pendingProducts"'));
test('HTML contiene #checkedProducts', () => html.includes('id="checkedProducts"'));
test('HTML contiene #super-shopping', () => html.includes('id="super-shopping"'));
test('HTML contiene #shoppingSearch', () => html.includes('id="shoppingSearch"'));
test('HTML contiene #manualTotal', () => html.includes('id="manualTotal"'));

// Test 2: JS tiene funciones necesarias
test('JS tiene toggleProductCheck', () => js.includes('toggleProductCheck'));
test('JS tiene renderShoppingMode', () => js.includes('renderShoppingMode'));
test('JS tiene enterShoppingMode', () => js.includes('enterShoppingMode'));
test('JS tiene uncheckProduct', () => js.includes('uncheckProduct'));
test('JS tiene searchInShopping', () => js.includes('searchInShopping'));
test('JS tiene finishShoppingWithTotal', () => js.includes('finishShoppingWithTotal'));

// Test 3: JS expone SupermarketV2
test('JS expone window.SupermarketV2', () => js.includes('window.SupermarketV2'));

// Test 4: CSS existe
test('CSS supermarket-v2.css existe', () => fs.existsSync('css/supermarket-v2.css'));
test('CSS styles.css existe', () => fs.existsSync('css/styles.css'));

// Test 5: Archivos JS existen
test('db.js existe', () => fs.existsSync('js/db.js'));
test('app.js existe', () => fs.existsSync('js/app.js'));
test('dashboard.js existe', () => fs.existsSync('js/modules/dashboard.js'));
test('expenses.js existe', () => fs.existsSync('js/modules/expenses.js'));

// Test 6: Assets existen
test('Logo existe', () => fs.existsSync('assets/logo.png'));
test('Manifest existe', () => fs.existsSync('manifest.json'));
test('Service Worker existe', () => fs.existsSync('sw.js'));

// Test 7: Sintaxis JS válida
test('Sintaxis JS válida en supermarket-v2.js', () => {
    try {
        new Function(js);
        return true;
    } catch (e) {
        console.error('Error de sintaxis:', e.message);
        return false;
    }
});

// Resultados
console.log('\n📊 RESULTADOS:\n');
tests.results.forEach(r => console.log(r));
console.log(`\n✅ Passed: ${tests.passed}`);
console.log(`❌ Failed: ${tests.failed}`);
console.log(`📊 Total: ${tests.passed + tests.failed}`);
console.log(`\n${tests.failed === 0 ? '🎉 TODAS LAS PRUEBAS PASARON' : '⚠️ HAY PRUEBAS FALLIDAS'}`);

process.exit(tests.failed > 0 ? 1 : 0);
