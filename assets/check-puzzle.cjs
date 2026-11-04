const { chromium }=require('C:/Users/ymy01/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url'); const path=require('path');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.resolve('yao_mingyi_portfolio.before-gutfeeling.html')).href);await page.waitForTimeout(1800);
const layouts=[];
for(let n=0;n<12;n++){
if(n) {await page.evaluate(()=>{navigate('works');navigate('home')});await page.waitForTimeout(650);}
layouts.push(await page.evaluate(()=>{const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom}};const text=[...document.querySelectorAll('.sketch-portfolio-title,.sketch-hero-greeting,.sketch-hero-instruction')].map(rect);const pieces=[...document.querySelectorAll('.floating-piece-wrapper')].map(rect);return {pieces,overlap:pieces.some(a=>text.some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top))}}));
}
const piece=page.locator('.floating-piece-wrapper').first();const box=await piece.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+20,box.y+box.height/2+15);
const drag=await piece.evaluate(el=>({transition:getComputedStyle(el).transitionDuration,x:el.style.getPropertyValue('--drag-x'),y:el.style.getPropertyValue('--drag-y')}));await page.mouse.up();
console.log(JSON.stringify({errors,overlaps:layouts.filter(l=>l.overlap).length,distinct:new Set(layouts.map(l=>JSON.stringify(l.pieces))).size,drag}));
await page.screenshot({path:'assets/preview-puzzle-random.png'});await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
