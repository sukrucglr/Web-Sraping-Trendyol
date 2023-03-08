
const fs = require('fs');

const puppeteer = require('puppeteer');

async function run() {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.trendyol.com/sr?wc=104192&sst=PRICE_BY_DESC');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);


    const prdct = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.p-card-wrppr'), (e) => ({
            title: e.querySelector('.prdct-desc-cntnr-name').innerText,
            comment: e.querySelector('.ratings-container').innerText,
            url: e.querySelector('a').href,
            price: e.querySelector('.prc-box-dscntd').innerText,


        })))
    console.log(prdct);

    const result = prdct.slice(0, 100);
    fs.writeFile('Trendyol_veri1.json', JSON.stringify(result), (err) => {
        if (err) throw err;
        console.log('Dosya Kaydedildi');

    });

    await browser.close();

}
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
run();