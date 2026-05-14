FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
# Vi installerer bare de nødvendige pakkene først
RUN npm install

# Vi tvinger Playwright til å installere nøyaktig det den trenger
RUN npx playwright install chromium

COPY . .

EXPOSE 3000
CMD ["node", "server.mjs"]
