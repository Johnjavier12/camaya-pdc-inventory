#FROM node:18.15.0
FROM node:12.16.2

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY /frontend/react-app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ADD ./frontend/react-app .

#RUN npm install --include=dev

RUN npm install --no-optional && npm cache clean --force

ENTRYPOINT ["/entrypoint.sh"]


CMD ["npm", "run", "build"]
