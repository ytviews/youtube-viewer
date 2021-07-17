FROM alpine:edge

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm \
      tor

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV NODE_ENV production
ENV YOUTUBE_VIEWER_FORCE_DEBUG false

# Create app directory
WORKDIR /app

# Copy app artifacts and dependencies
COPY ./core ./core
COPY ./handlers ./handlers
COPY ./helpers ./helpers
COPY ./services ./services
COPY ./utils ./utils
COPY viewer.js .
COPY searcher.js .
COPY ./package.json .
COPY urls.json .
COPY keys-words.txt .

RUN npm install

CMD ["node", "viewer" ,"--color=16m"]
