FROM node:12.18.4-alpine
WORKDIR /app
ADD package*.json .
RUN npm install
ADD . .
CMD ["npm", "run", "start-prod"]
