FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Installer Playwright-verktøyene manuelt for å matche operativsystemet
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps chromium

COPY . .

EXPOSE 3000
CMD ["node", "server.mjs"]
