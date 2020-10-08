FROM node:14

RUN npm install pm2 -g

WORKDIR /code

COPY package*.json ./

RUN npm i

COPY . .

CMD ["pm2-runtime", "index.js"]