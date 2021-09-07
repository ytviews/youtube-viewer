import { concat } from 'lodash';
export const isProduction = (process.env.NODE_ENV === 'production');
export const SHOULD_FORCE_DEBUG_LOGS = process.env.YOUTUBE_VIEWER_FORCE_DEBUG;
export const IP_GETTER_URL = 'https://api.myip.com';
export const URL_JSON_FILE_NAME = 'urls.json';
export const URL_JSON_FILE_YOUTUBE = 'src/config/youtube-admin.json';
export const URL_JSON_FILE_YOUTUBE_ACCOUNTS = 'src/config/account.json';
export const URL_KEYS_WORDS_FILE_NAME = 'keys-words.txt';
export const CHROMIUM_EXECUTABLE_PATH = isProduction ? '/usr/bin/chromium-browser' : undefined
export const YOUTUBE_LOGIN_URL = "https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin"

/**
 * START_PORT - Port TOR will start using from for SOCKS proxy.
 * BATCH_COUNT - Number of parallel chromium instances to run.
 * TOTAL_COUNT - Total number of view actions. A single view action comprises of sequential viewing of VIEW_ACTION_COUNT random videos among the list. Ensure this number is exactly divisible by BATCH_COUNT for optimal resource usage.
 * VIEW_ACTION_COUNT - A single browsing session will watch these many videos sequentially.
 * VIEW_DURATION - Max duration of a single view in seconds. Actual view duration will be +/- 16.6% of this number.
 * PAGE_DEFAULT_TIMEOUT - Max duration in seconds to wait for any action in the page.
 */
export const START_PORT = 9052;
export const BATCH_COUNT = isProduction ? 6 : 1;
export const TOTAL_COUNT = 96;
export const VIEW_ACTION_COUNT = 10;
export const VIEW_DURATION = 530;
export const PAGE_DEFAULT_TIMEOUT = 600;

const extensions = {
    AdGuard: `${CHROMIUM_EXECUTABLE_PATH}/extensions/bgnkhhnnamicmpeenaelnjfhikgbkllg/3.3.2_0`,
    PageTimer: `${CHROMIUM_EXECUTABLE_PATH}/extensions/enljfpkeopdppbphgadibdpodgjhmabm/1.7_0`,
    PupeteerRecorder: `${CHROMIUM_EXECUTABLE_PATH}/extensions/djeegiggegleadkkbgopoonhjimgehda/0.7.1_0`,
    TaskHelper: `${CHROMIUM_EXECUTABLE_PATH}/extensions/taskhelp`,
    // TimeShift: `${CHROMIUM_EXECUTABLE_PATH}/extensions/nbofeaabhknfdcpoddmfckpokmncimpj/0.1.4_0`,
    VkUnblock: `${CHROMIUM_EXECUTABLE_PATH}/extensions/ceoldlgkhdbnnmojajjgfapagjccblib/3.0.5_0`,
    WebRTC: `${CHROMIUM_EXECUTABLE_PATH}/extensions/bppamachkoflopbagkdoflbgfjflfnfl/1.0.4_0`
};

const BASE_CHROMIUM_ARGS = [
    // `--disable-extensions-except=${extensions.PupeteerRecorder},${extensions.WebRTC},${extensions.VkUnblock},${extensions.PageTimer},${extensions.TaskHelper}`,
    // `--load-extension=${extensions.AdGuard}`,
    // `--load-extension=${extensions.PupeteerRecorder}`,
    // `--load-extension=${extensions.WebRTC}`,
    // `--load-extension=${extensions.VkUnblock}`,
    // `--load-extension=${extensions.PageTimer}`,
    // `--load-extension=${extensions.TaskHelper}`,
    // `--load-extension=${extensions.TimeShift}`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    // '--disable-features=IsolateOrigins',
    // '--disable-site-isolation-trials',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-crash-reporter',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    // This will write shared memory files into /tmp instead of /dev/shm,
    // because Docker’s default for /dev/shm is 64MB
    '--disable-dev-shm-usage',
    '--no-first-run',
    // '--no-zygote',
    // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

// Defaults
export const CHROMIUM_ARGS: Array<any> = concat(BASE_CHROMIUM_ARGS, JSON.parse(process.env.CHROMIUM_ARGS || '[]'));
export const TIMEOUT: number = Number(process.env.TIMEOUT) || 30 * 1000;
export const IGNORE_HTTPS_ERRORS: boolean = process.env.IGNORE_HTTPS_ERRORS === 'true' || true;
const VIEWPORT_WIDTH: number = Number(process.env.VIEWPORT_WIDTH) || 1280;
const VIEWPORT_HEIGHT: number = Number(process.env.VIEWPORT_HEIGHT) || 800;
const DEVICE_SCALE_FACTOR: number = Number(process.env.DEVICE_SCALE_FACTOR) || 1;
const IS_MOBILE: boolean = (process.env.IS_MOBILE === 'true');
const IS_LANDSCAPE: boolean = (process.env.IS_LANDSCAPE === 'true');

export const defaultViewport = {
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR, // deviceScaleFactor: 1 => for high dpi
    isMobile: IS_MOBILE,
    isLandscape: IS_LANDSCAPE
};

// Congolese
const CONGOLESE_GENRES = ['male', 'female'];
export const CONGOLESE_GENRE = CONGOLESE_GENRES[Math.floor(Math.random() * CONGOLESE_GENRES.length)];
export const CONGOLESE_GETTER_URL = `https://es.fmsppl.com/names/generator/dr-congo/${CONGOLESE_GENRE}/`;
