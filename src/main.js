const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const prompt = require("prompt-sync")();

require("dotenv").config();

const email = process.env.email;
const password = process.env.password;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginWithPassword(driver) {
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);

    let loginBtn = await driver.findElement(
        By.className(
            "marginBottom8_f7730b button_b83a05 button_dd4f85 lookFilled_dd4f85 colorBrand_dd4f85 sizeLarge_dd4f85 fullWidth_dd4f85 grow_dd4f85"
        )
    );

    await delay(5000);

    await loginBtn.click();

    const authentif = prompt("Write 6 digit code:\n");
    await driver.findElement(By.className("inputDefault_f8bc55 input_f8bc55")).sendKeys(authentif);

    // ! The button is disabled until all 6 digits are entered, so a delay is added to ensure the button becomes enabled.
    await delay(5000);

    let confirmBtn = await driver.findElement(
        By.className("button_dd4f85 lookFilled_dd4f85 colorBrand_dd4f85 sizeMedium_dd4f85 grow_dd4f85")
    );

    await confirmBtn.click();
}

async function main() {
    let driver = await new Builder().forBrowser(Browser.SAFARI).build();
    driver.manage().window().setRect({ width: 1280, height: 720 });

    try {
        await driver.get("https://discord.com/login");

        const method = prompt("Do you want to login with QR code ?\n");

        if (method === "NO") {
            await loginWithPassword(driver);
        }

        await driver.wait(until.titleContains("Friends"));
    } finally {
        prompt("Script ended...");
        await driver.quit();
    }
}

main();
