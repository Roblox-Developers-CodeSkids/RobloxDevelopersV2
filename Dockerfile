FROM node:14.13

RUN npm install pm2 -g

WORKDIR /code

ENV NODE_ENV=production

COPY package*.json ./

RUN npm i

COPY . .

CMD ["pm2-runtime", "index.js"]