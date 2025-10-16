FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /var/task

COPY lambda/handler.ts ./
COPY package.json tsconfig.json ./
COPY .env ./

RUN npm install && npm run build

ENV MONGO_URI=""
ENV DB_NAME="cloudnotes"
ENV COLLECTION_NAME="notes"

CMD ["handler.handler"]
