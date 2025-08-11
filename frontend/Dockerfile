FROM node:14-alpine
WORKDIR /usr/src/app

ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
