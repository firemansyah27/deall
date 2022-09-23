FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package.json /usr/src/app/

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]