const {chromium} = require('C:/Users/ymy01/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const {pathToFileURL} = require('url');
(async()=>{
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve('yao_mingyi_portfolio.html')).href);
 await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(800);
 await page.screenshot({path:'assets/preview-home.png'});
 await page.evaluate(()=>navigate('works')); await page.waitForTimeout(600);
 await page.screenshot({path:'assets/preview-works.png'});
 const rects=[];
 for(let i=0;i<4;i++){
  await page.evaluate(i=>selectOverviewWork(i),i);
  const info=await page.evaluate(()=>{const box=document.querySelector('.bigshot-footer-bar').getBoundingClientRect();const media=document.querySelector('#worksBigshotCanvas');const v=media.querySelector('video');return {y:box.y,bottom:box.bottom,images:media.querySelectorAll('img').length,video:!!v,controls:v?.controls,autoplay:v?.autoplay};});rects.push(info);
 }
 await page.evaluate(()=>openDetail(0)); await page.waitForTimeout(550);await page.screenshot({path:'assets/preview-detail.png'});
 await page.evaluate(()=>navigate('about')); await page.waitForTimeout(550);await page.screenshot({path:'assets/preview-about.png'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>navigate('works'));await page.waitForTimeout(550);await page.screenshot({path:'assets/preview-mobile.png',fullPage:true});
 console.log(JSON.stringify({errors,rects,mobileOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
