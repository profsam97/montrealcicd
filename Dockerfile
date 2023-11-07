FROM node:14 AS buildnode
WORKDIR /usr/src/app
RUN git clone https://github.com/profsam97/montreal.git
RUN cd montreal  && npm install
RUN cd montreal && npm run build

FROM node:14
WORKDIR /usr/src/app
COPY --from=buildnode /usr/src/app /usr/src/app/
EXPOSE 5000
CMD [ "npm", "start" ]