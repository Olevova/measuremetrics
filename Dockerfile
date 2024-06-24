FROM node

WORKDIR /app

COPY package*.json ./
COPY . .
# COPY ./src/classes/view/area/Logo.png ./src/classes/view/area/

RUN npm install

CMD ["npm", "run", "test"]
