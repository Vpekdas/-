const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const prompt = require("prompt-sync")();

require("dotenv").config();

const email = process.env.email;
const password = process.env.password;

function randomDelay(min, max) {
    return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

async function loginWithPassword(driver) {
    await randomDelay(3000, 7000);

    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);

    let loginBtn = await driver.findElement(
        By.className(
            "marginBottom8_f7730b button_b83a05 button_dd4f85 lookFilled_dd4f85 colorBrand_dd4f85 sizeLarge_dd4f85 fullWidth_dd4f85 grow_dd4f85"
        )
    );

    await loginBtn.click();

    await randomDelay(3000, 7000);

    const authentif = prompt("Write 6 digit code:\n");
    await driver.findElement(By.className("inputDefault_f8bc55 input_f8bc55")).sendKeys(authentif);

    // ! The button is disabled until all 6 digits are entered, so a delay is added to ensure the button becomes enabled.
    await randomDelay(3000, 7000);

    let confirmBtn = await driver.findElement(
        By.className("button_dd4f85 lookFilled_dd4f85 colorBrand_dd4f85 sizeMedium_dd4f85 grow_dd4f85")
    );

    await confirmBtn.click();
}

async function main() {
    let driver = await new Builder().forBrowser(Browser.SAFARI).build();
    driver.manage().window().setRect({ width: 1280, height: 720, x: 0, y: 0 });

    try {
        await driver.get("https://discord.com/login");

        const method = prompt("Do you want to login with QR code ?\n");

        if (method === "no") {
            await loginWithPassword(driver);
        }

        await driver.wait(until.titleContains("Friends"));

        await randomDelay(3000, 7000);

        const discordServer = await driver.findElement(By.className("blobContainer_a5ad63"));
        await discordServer.click();

        await randomDelay(3000, 7000);

        const messageId = prompt("Please enter the id of the message.\n");

        const messageToReact = await driver.findElement(By.id("message-content-" + messageId));

        if (messageToReact) {
            console.log("Message Found !");
        }

        await randomDelay(3000, 7000);

        const actions = driver.actions({ async: true });
        await actions.move({ origin: messageToReact }).perform();

        await randomDelay(3000, 7000);

        prompt("Script ended...");
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        if (driver) {
            try {
                await driver.quit();
            } catch (quitError) {
                console.error("Error quitting the driver:", quitError);
            }
        }
    }
}

main();
