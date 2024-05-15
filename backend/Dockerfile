FROM golang:1.17.2-bullseye as builder
WORKDIR /go/src
COPY /src/ascii_image_generator .
RUN CGO_ENABLED=1 go build -buildmode=c-shared -o ascii_image_converter.so main.go


FROM python:3.9
WORKDIR /app
ADD requirements.txt .
RUN pip3 install -r requirements.txt
RUN python3 -m nltk.downloader punkt stopwords reuters averaged_perceptron_tagger
COPY . .
COPY --from=builder /go/src/ascii_image_converter.so /app/src/libraries/ascii_image_generator.so
EXPOSE 50505
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:50505", "app:flask_app"]