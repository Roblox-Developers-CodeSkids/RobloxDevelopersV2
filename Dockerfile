FROM node:14

RUN npm install pm2 -g

WORKDIR /code

COPY package*.json ./

RUN npm i

COPY . .

ENV NODE_ENV=production

CMD ["pm2-runtime", "index.js"]