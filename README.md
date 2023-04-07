```

     '-.                 
        '-. _____     __   __          _         _           __     ___                         
 .-._      |     '.   \ \ / ___  _   _| |_ _   _| |__   ___  \ \   / (_) _____      _____ _ __  
:  ..      |      :    \ V / _ \| | | | __| | | | '_ \ / _ \  \ \ / /| |/ _ \ \ /\ / / _ | '__| 
'-._+      |    .-'     | | (_) | |_| | |_| |_| | |_) |  __/   \ V / | |  __/\ V  V |  __| |    
 /  \     .'i--i        |_|\___/ \__,_|\__|\__,_|_.__/ \___|    \_/  |_|\___| \_/\_/ \___|_|    
/    \ .-'_/____\___
    .-'  :          :
                        
```

## Introduction

A modern (and portable) approach to inflating view counts in Youtube - using [Puppeteer](https://pptr.dev/),  [TOR](https://www.torproject.org/) rotating proxies and [Docker](https://www.docker.com/).

> **Disclaimer:** This project is intended for informational/educational purposes only. I strictly recommend against using it to artificially inflate video view counts for monetary benefits and/or other use cases that goes against the Youtube Policies & Guidelines and/or the law of the land.

## Prerequisites

 1. Install [Docker Engine](https://docs.docker.com/engine/install/)
 2. Install [Docker Compose](https://docs.docker.com/compose/install/)
 3. Clone the repo (or download it).
 4. Copy the video urls to `urls.txt` file (**Note**: A line may contain a single URL only)

## Build & Run Steps

The following commands will help create a docker image, build the app and run it -

```console
~$ docker-compose build
~$ docker-compose up --scale ytview=5
```
    
  If you happen to have *npm* in your system, you can also choose to run the app via -

```console
~$ npm run build 
~$ npm start ytview=3
```

## Fine tuning for performance

### Concepts: 

 - **Batch**: Browser instances running in parallel.
 - **Batch Count**: Number of parallel browser instances to run.
 - **View Action**: This represents a single browser instance picking up a fixed number of urls from the pool and visiting them sequentially.
 - **View Action Count**: A single browsing session will watch these many videos sequentially.
 - **Total Count** - Total number of view actions. Ensure this number is exactly divisible by **Batch Count** for optimal resource utilisation.
 - **View Duration** - Average duration in seconds of a single view in view action. Actual view duration will be +/- 16.6% of this number.

You may choose to alter the above params in `utils/constants/index.js` for fine tuning according to your needs. 

Also, the above commands runs 5 docker containers in parallel (which will translate to 5 x **Batch Count** number of Chromium instances running simultaneously) . Adjust this according to how capable your system is.

[YouTube-Viewer](https://github.com/MShawon/YouTube-Viewer)
[YouTubeViews](https://github.com/Bitwise-01/YouTubeViews-)
[YouTube-View-Bot](https://github.com/joe-habel/YouTube-View-Bot)
[Youtube-bot](https://github.com/leejh3224/youtube-bot)
[Youtube-viewbot](https://github.com/Plasmonix/Youtube-viewbot)
[YouTubeShop](https://github.com/BitTheByte/YouTubeShop)
[free-proxy-list](https://free-proxy-list.net)
[YTviewer](https://github.com/davidas13/ytviewer)
[YouTube_Views_Bot](https://github.com/iChickn/YouTube_Views_Bot)
[YoutubeViewBot](https://github.com/CodsXBlastin/YoutubeViewBot)
[Search Youtube View Bot](https://github.com/search?q=bot+youtube+views+language%3APython&type=repositories&l=Python&p=2)

[Auto-Gmail-Creator](https://github.com/leostech/Auto-Gmail-Creator)
[Gmail-account-creation-bot-appium-browserstack](https://github.com/shoaibatiq/gmail-account-creation-bot-appium-browserstack)
[Gmail Bot](https://github.com/lavclash75/gmail-bot)