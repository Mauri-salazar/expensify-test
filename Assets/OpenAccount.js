const { Builder, By, Key, until } = require('selenium-webdriver');

(async function abrirCuentaGoogle() {
  // Crea una instancia del navegador Chrome
    const driver = await new Builder().forBrowser('chrome').build();

    try {
    // Abre la página de inicio de sesión de Google
    await driver.get('https://accounts.google.com');

    // Ingresa tu dirección de correo electrónico y presiona Enter
    await driver.findElement(By.id('identifierId')).sendKeys('tucorreo@gmail.com', Key.RETURN);

    // Espera a que se cargue la página de contraseña
    await driver.wait(until.elementLocated(By.name('password')), 5000);

    // Ingresa tu contraseña y presiona Enter
    await driver.findElement(By.name('password')).sendKeys('tucontraseña', Key.RETURN);

    // Espera a que se abra la cuenta de Google
    await driver.wait(until.titleIs('Gmail - Correo electrónico de Google'), 10000);

    console.log('Cuenta de Google abierta con éxito.');
    } finally {
    // Cierra el navegador al finalizar
    await driver.quit();
    }
})();
