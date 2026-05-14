# Vi bruker en versjon som allerede har Chromium innebygget
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Kopier og installer
COPY package*.json ./
RUN npm install

# Kopier resten av koden
COPY . .

# Startinnstillinger
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.mjs"]
