FROM node:16-alpine

WORKDIR /web

COPY package*.json ./
COPY . .

RUN npm install

RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm install axios
RUN npm install react-router-dom

EXPOSE 3000

CMD ["npm", "start"]
