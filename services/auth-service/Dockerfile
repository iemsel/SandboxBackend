FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
#RUN npm install
RUN npm build

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
