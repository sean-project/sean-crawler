import puppeteer from 'puppeteer';
import {sleep} from "./helpers";
import * as mongodb from 'mongodb'
import cookies from './cookies.json'
function Random(min:number, max:number) {
    return Math.round(Math.random() * (max - min)) + min;
}
const mongourl = "mongodb://192.168.0.107:27017/sean";
(async () => {
    const db = await mongodb.MongoClient.connect(mongourl)
    const dbo = db.db("sean")

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    page.on('response', async response => {
        if (response.url().includes('comments/hotflow?id=')){
            try {
                await dbo.collection("comment").insertMany([await response.json()])
            } catch (e) {

            }
        }
    })


    try {
        for (let i = 0; i < cookies.length; i++) {
            await page.setCookie(cookies[i] as any)
        }

        await page.goto('https://m.weibo.cn/detail/4885855669328710');
        await page.setViewport({width: 375, height: 700});


        let previousHeight;
        while (true) {
            try {
                previousHeight = await page.evaluate('document.body.scrollHeight')
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`)
                await sleep(Random(1000,3000))
            } catch (e) {
                console.log('Scroll End Page')
                break
            }
        }
    } catch (e) {

    }

    // for (let i = 0; i < starNames.length; i++) {
    //
    //     try {
    //         await page.goto('https://m.weibo.cn/search?containerid=231583');
    //         // Set screen size
    //         await page.setViewport({width: 375, height: 1024});
    //     } catch (e) {
    //
    //     }
    //     try {
    //         await page.waitForSelector("input[type=search]",{timeout:500})
    //     } catch (e) {
    //
    //     }
    //     // Type into search box
    //     try {
    //         await page.type("input[type=search]", starNames[i]);
    //     }catch (e) {
    //
    //     }
    //
    //     // 回车
    //     await page.keyboard.press('Enter');
    //     // Wait and click on first result
    //     const searchResultSelector = 'div.card.m-panel.card28.m-avatar-box > div > div > div > div.m-img-box';
    //     try {
    //         await page.waitForSelector(searchResultSelector,{timeout:500})
    //     } catch (e) {
    //
    //     }
    //     try {
    //         await page.click(searchResultSelector);
    //     } catch (e) {
    //
    //     }
    //
    //
    //     // const response = await page.waitForResponse((res)=>res.url().includes('api/container/getIndex?uid'))
    //     // await dbo.collection("star").insertMany([await response.json()])
    //     await sleep(600)
    // }
    // await browser.close();
})();
