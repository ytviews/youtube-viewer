const chrome = require('chrome-cookies-secure');
const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json'); // contains username and password to use
const url = 'https://www.yoururl.com';

const getCookies = (callback) => {
  chrome.getCookies(url, 'puppeteer', function(err, cookies) {
    if (err) {
      console.log(err, 'error');
      return;
    }
    console.log(cookies, 'cookies');
    callback(cookies);
  }, 'yourProfile'); // e.g. 'Profile 2'
};
// const delay = ms => new Promise(res => setTimeout(res, ms));
const courseId = process.argv[2];
if (!courseId) {
  // eslint-disable-next-line no-throw-literal
  throw 'Please provide a course_id as the first argument';
}
console.log('course_id is ', courseId);
console.dir(courseId, { depth: null, colors: true });

const loginUrl='http://'+config.canvas.host+'/login/canvas';
console.info('login_url is ', loginUrl);

getCookies(async (cookies) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.setCookie(...cookies);
  await page.goto(url);
  await page.waitFor(1000);
  browser.close();
});

(async () => {
  const browser = await puppeteer.launch({ headless: false, userDataDir: './puppeteer_data' });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  await page.goto(loginUrl, { waitUntil: 'load' });
  console.log(page.url());

  // Type our username and password
  await page.type('#pseudonym_session_unique_id', config.canvas.username); // it you pass a third argument {delay: 100} - it will be similar to a user typing
  await page.type('#pseudonym_session_password', config.canvas.password);

  // Submit form
  await page.click('.Button.Button--login');

  // delay(3000);
  page.waitFor(3000); // the Dashboard does not render correctly in my Canvas instance, hence just wait and then go elsewhere

  // Go to the page for Question banks and Wait for the page to load
  const qbUrl = 'http://'+config.canvas.host+'/courses/'+courseId+'/question_banks';
  console.log('qb_url is ', qbUrl);
  await page.goto(qbUrl, { waitUntil: 'load' });
  console.log('FOUND!', page.url());

  const cookies = await page.cookies();
  console.info('cookies are ', cookies);

  fs.writeFile('canvas-session.json', JSON.stringify(cookies, null, 2), function(err) {
    if (err) throw err;
    console.log('completed write of cookies');
  });


  const token = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    const token1 = document.querySelector('#edit_bank_form input[name=authenticity_token]').value; // output the token just to see it
    return token1;
  });
  console.info('token', token);

  browser.close();
})();

(async () => {
  const cookiesString = fs.readFileSync('./canvas-session.json', 'utf8');
  // console.log("cookiesString are ", cookiesString);
  const cookies = JSON.parse(cookiesString);
  // console.log("cookies are ", cookies);

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

  const browser = await puppeteer.launch({ headless: false,
    userDataDir: '/home/maguire/puppeteer/puppeteer_data',
  });


  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });

  page.waitFor(1000);
  console.info('setting cookies');
  // eslint-disable-next-line prefer-spread
  await page.setCookie.apply(page, cookies);


  // Go to the page for Question banks and Wait for the page to load
  const qbUrl='http://'+config.canvas.host+'/courses/'+courseId+'/question_banks';
  console.log('qb_url is ', qbUrl);
  await page.goto(qbUrl, { waitUntil: 'load' });
  console.log('FOUND!', page.url());

  const token = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    const token1 = document.querySelector('#edit_bank_form input[name=authenticity_token]').value; // output the token just to see it
    return token1;
  });
  console.info('token', token);

  const title='A new and interesting question bank';
  await page.$eval('#edit_bank_form #assessment_question_bank_title', (el, _title) => el.value = _title, title); // output the token just to see it

  const f1 = await page.$eval('form#edit_bank_form', (form) => form.submit());
  page.waitFor(3000);
  console.info('f1', f1);


  await page.screenshot({ path: 'login4.png' });

  // Extract the results from the page
  const links = await page.evaluate(() => {
    const questionBanks = []; // this will collect the question bank informatio

    // eslint-disable-next-line no-undef
    const anchors = Array.from(document.querySelectorAll('.question_bank'));
    anchors.forEach(function(anchor) {
      const jsonObject = {
        id: anchor.id,
        title: anchor.querySelector('.title').text,
        href: anchor.querySelector('.title').href,
      };
      questionBanks.push(jsonObject);
    });

    return questionBanks;
    // return anchors.map(anchor => anchor.id+','+anchor.querySelector('.title').href+','+anchor.querySelector('.title').text); // textContent
  });
  // console.log(links.join('\n'));

  fs.writeFile('results5.json', JSON.stringify(links), function(err) {
    if (err) throw err;
    console.log('completed writing JSON information about question banks');
  });

  browser.close();
})();
