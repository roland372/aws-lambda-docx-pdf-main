FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.4-node16-x86_64 as builder
WORKDIR /usr/app
COPY . ./
RUN npm install
RUN npm run build

FROM public.ecr.aws/shelf/lambda-libreoffice-base:7.4-node16-x86_64
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./

#COPY template.docx ../../tmp
#COPY template1.docx ../../tmp

COPY template.docx .
COPY template1.docx .

CMD ["app.docxMergerHandler"]