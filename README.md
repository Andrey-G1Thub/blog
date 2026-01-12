Проект "Блог веб-разработчика" (Fullstack)
Проект, реализованный на стеке MERN с использованием Docker.

Стек технологий:
Frontend: React, Redux, Styled-components.
Backend: Node.js, Express, MongoDB, Mongoose.
DevOps: Docker, Docker Hub, развертывание на VPS (Timeweb).

Сайт доступен по адресу:

## http://5.129.197.215

Как запустить проект локально:

1. Обычный запуск
   Склонируйте репозиторий.
   Создайте файл .env в папке backend на основе .env.example.

В терминале бэкенда:

## cd backend

## npm install

## npm run dev

В терминале фронтенда:

## cd frontend

## npm install

## npm start

2. Запуск через Docker
   В корневой папке проекта выполните:

## docker build -t my-blog-app .

## docker run -d -p 80:3001 --name my-blog-app my-blog-app

Особенности реализации:
Реализована загрузка изображений двумя способами: через файл (multer) и через внешнюю ссылку.

Настроены Docker Volumes для сохранения загруженных файлов на сервере.
