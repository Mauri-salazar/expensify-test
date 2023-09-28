const  fs   = require("fs");
const puppeteer  = require("puppeteer");
const  puppeteerCore  = require("puppeteer-core");

function writeVersionToFile(version) {
    fs.writeFileSync('version.txt', version, 'utf8');
}


function extractVersion(inputString) {
    // Define a regular expression pattern to match the version format v1.3.74-2
    const versionPattern = /v\d+\.\d+\.\d+-\d+/;

    // Use the match() function to find the first occurrence of the pattern
    const match = inputString.match(versionPattern);

    // Verifique si se encontró una coincidencia y devuélvala, o devuelva nulo si no se encontró ninguna coincidencia
    if (match) {
        return match[0];
    } else {
        return null;
    }
}


const runScript = async () => {
    const browser = await puppeteerCore.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: false,
        userDataDir:'/home/eugenia/.config/google-chrome/Profile 1',
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
        defaultViewport: null,
        ignoreDefaultArgs: ['--disable-extensions'],
    }).then(async browser => {
        const page = await browser.newPage();

        await page.goto('https://staging.new.expensify.com', { waitUntil: "load", });

        // Set screen size
        await page.setViewport({ width: 1200, height: 800 });


        const selectorButton = '[aria-label="My settings"]'
        await page.waitForSelector(selectorButton);
        const settingsButton = await page.click(selectorButton);
        await page.click(selectorButton)

        const aboutSelector = '[aria-label="About"]'
        await page.waitForSelector(aboutSelector);
        const aboutButton = await page.click(aboutSelector);

        const versionSelector = "div[class='css-175oi2r r-150rngu r-eqz5dr r-16y2uox r-1wbh5a2 r-11yh6sk r-1rnoaur r-1sncvnh'] > div > div > div"
        await page.waitForSelector(versionSelector);
        let element = await page.$(versionSelector)
        let value = await page.evaluate(el => el.textContent, element)
        const version = extractVersion(value);
        console.log(version)
                    
        try {
            const oldVersion = fs.readFileSync('version.txt', 'utf8');
            
            if (oldVersion !== version) {
                const selectorPlusSign = '[aria-label="Send message (Floating action)"]';
                await page.waitForSelector(selectorPlusSign);
                const plusSign = await page.click(selectorPlusSign);
                await page.click(selectorPlusSign)
                
                // const selectorSendMg = '[aria-label="Send message"]';
                // await page.waitForSelector(selectorSendMg);
                // await page.click(selectorSendMg);
        
                // const selectorInput = 'div.css-175oi2r.r-12vffkv input[aria-label="Name, email, or phone number"]';
                // await page.waitForSelector(selectorInput);
                // await page.click(selectorInput);             
                // const emailInsert = 'salazar.mauricio.dev@gmail.com';
                // await page.type(selectorInput, emailInsert);
    
                // const selectorChat = '[aria-label="salazar.mauricio.dev@gmail.com"]';
                // await page.waitForSelector(selectorChat);
                // await page.click(selectorChat);
        
                // const textareaSelector = 'div.css-175oi2r div.css-175oi2r div.css-175oi2r textarea';
                // await page.waitForSelector(textareaSelector);
                // await page.click(textareaSelector);
                // const textareaMg = 'Expensify actualizo a:' + version  + 'PONETE A TRABAJAR';
                // await page.type(textareaSelector, textareaMg);

                console.log("Hay una nueva version: ", version)
                writeVersionToFile(version);    
            
            } else {
                console.log("Misma version detectada ", version)
            }

        } catch (err) { 
            console.log(err);
            writeVersionToFile(version);
        }

        await browser.close();
    })
};

setInterval(runScript, 10000);