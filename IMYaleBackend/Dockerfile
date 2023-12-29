FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm uninstall pm2
RUN npm install -g pm2

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "prod" ]
