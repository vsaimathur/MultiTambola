FROM node:15
WORKDIR /usr/src/app
RUN mkdir client
RUN cd client
COPY client/package*.json ./
RUN npm i
COPY client/ ./
RUN npm run build
RUN cd ..
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

