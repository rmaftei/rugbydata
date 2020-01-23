const puppeteer = require("puppeteer");
const config = require("./config");

const getData = async ()=> {
    const browser =await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--headless', '--disable-gpu']});
        
    let page = await browser.newPage();

    await page.goto(config.url, {awaitUntil: 'networkidle2'});

    let data = await page.evaluate(() => {
        const sanitize = (stringValue) => {
            return stringValue.replace("\nora", "");
        };

        const getGameDetails = (document, idx) => {
            return {
                kickoff: sanitize(document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(1)`).innerText),
                stadium: document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(3)`).innerText,
                stadium: document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(3)`).innerText,
                title: document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(4)`).innerText,
                score: document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(5)`).innerText,
                tvChannel: document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${idx}) > td:nth-child(6)`).innerText
            }
        };

        let title = document.querySelector('.sl_team_header h2').innerText

        const TOTAL_ETAPE = 14;
        const STEP = 5;
        let games = []
        let stageNumber = 1;

        for(let i = 1; i <= TOTAL_ETAPE * STEP; i = i + STEP) {
            games.push(Object.assign(getGameDetails(document, i + 2), {stage: stageNumber}));
            games.push(Object.assign(getGameDetails(document, i + 3), {stage: stageNumber}));
            games.push(Object.assign(getGameDetails(document, i + 4), {stage: stageNumber}));

            stageNumber = stageNumber + 1;
        }

        return {
            title,
            games
        }
    });

    await browser.close();

    return data;
};

module.exports.data = () => {
    return (async () => {
        return await getData();
      })()
}
