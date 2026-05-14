# Vi oppdaterer fra v1.40.0 til v1.44.0 (en mer stabil versjon for Render)
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Kopier pakke-filer
COPY package*.json ./

# Installer alle verktøy (inkludert CORS)
RUN npm install

# Kopier resten av koden
COPY . .

# Eksponer porten Render bruker
EXPOSE 3000

# Start serveren
CMD ["node", "server.mjs"]
