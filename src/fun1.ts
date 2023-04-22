import puppeteer from 'puppeteer';
import {sleep} from "./helpers";
import * as mongodb from 'mongodb'
import starNames from './starNames.json'

const mongourl = "mongodb://192.168.0.107:27017/sean";
(async () => {
    const db = await mongodb.MongoClient.connect(mongourl)
    const dbo = db.db("sean")

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    page.on('response', async response => {
        if (response.url().includes('api/container/getIndex?uid')){
            try {
                await dbo.collection("star").insertMany([await response.json()])
            } catch (e) {

            }
        }
    })
    for (let i = 0; i < starNames.length; i++) {

        try {
            await page.goto('https://m.weibo.cn/search?containerid=231583');
            // Set screen size
            await page.setViewport({width: 375, height: 1024});
        } catch (e) {

        }
        try {
            await page.waitForSelector("input[type=search]",{timeout:500})
        } catch (e) {

        }
        // Type into search box
        try {
            await page.type("input[type=search]", starNames[i]);
        }catch (e) {

        }

        // 回车
        await page.keyboard.press('Enter');
        // Wait and click on first result
        const searchResultSelector = 'div.card.m-panel.card28.m-avatar-box > div > div > div > div.m-img-box';
        try {
            await page.waitForSelector(searchResultSelector,{timeout:500})
        } catch (e) {

        }
        try {
            await page.click(searchResultSelector);
        } catch (e) {

        }


        // const response = await page.waitForResponse((res)=>res.url().includes('api/container/getIndex?uid'))
        // await dbo.collection("star").insertMany([await response.json()])
        await sleep(600)
    }
    // await browser.close();
})();
