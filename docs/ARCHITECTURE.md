# RASTISHKA CRM — Черновой план системы онлайн-курсов

## Контекст

Платформа онлайн-курсов для детского инклюзивного садика "Растишка". Курсы — массаж для детей. Аудитория — СНГ (русскоязычные пользователи).

---

## Стек технологий

| Слой | Технология | Почему |
|------|-----------|--------|
| Фреймворк | **Next.js 14+ (App Router)** | Фронт + бэк в одном проекте, SSR, API Routes |
| Язык | **TypeScript** | Типизация на всём стеке |
| UI | **shadcn/ui + Tailwind CSS** | Быстрая сборка UI, хорошие таблицы для админки |
| ORM | **Prisma** | Типобезопасный доступ к БД, миграции, Prisma Studio для просмотра данных |
| База данных | **PostgreSQL** | Надёжная, бесплатная, идеальна для реляционных данных |
| Авторизация | **Auth.js (NextAuth v5)** | Ролевой доступ (ADMIN / STUDENT), middleware-защита маршрутов |
| Видео | **Bunny Stream** | Дёшево (~$1-5/мес на MVP), CDN, адаптивный битрейт, DRM |
| Оплата | **Позже** (YooKassa, Click/Payme) | Сначала платформа, оплата — в следующих фазах |
| Деплой | **Docker Compose** на любой VPS | Один файл — и всё работает |

---

## Архитектура

```
           Nginx/Caddy (SSL, HTTPS)
                    |
             Next.js App
          /          |         \
    (public)    (student)    (admin)
     каталог    мои курсы    CRM-панель
         \         |         /
          PostgreSQL (Prisma)
              |
        Bunny Stream
```

- **(public)** — каталог курсов, лендинг, регистрация/вход
- **(student)** — личный кабинет, просмотр уроков, прогресс
- **(admin)** — управление курсами, пользователями, записями, аналитика

---

## Схема базы данных (основные модели)

- **User** — id, email, phone, name, role (ADMIN/STUDENT), passwordHash
- **Course** — id, title, description, thumbnailUrl, price, currency, isPublished
- **Lesson** — id, courseId, title, videoUrl, order, duration, isFree
- **Enrollment** — id, userId, courseId, status, enrolledAt
- **Progress** — id, userId, lessonId, completed, watchedSeconds

---

## MVP — Фазы разработки

### Фаза 1: Фундамент (Неделя 1-2)
- Скаффолдинг проекта: Next.js + TS + Tailwind + shadcn/ui
- Prisma-схема и настройка PostgreSQL
- Auth.js (email/пароль + роли)
- Middleware для защиты маршрутов
- Docker Compose (app + postgres)
- Базовый layout: header, навигация, responsive

### Фаза 2: Курсы и каталог (Неделя 2-3)
- Админка: CRUD курсов (создание, редактирование, публикация)
- Админка: CRUD уроков внутри курса (добавление, порядок, удаление)
- Интеграция Bunny Stream для видео
- Публичный каталог курсов
- Страница курса с описанием и списком уроков
- Бесплатный превью-урок

### Фаза 3: Записи и личный кабинет (Неделя 3-4)
- Ручная запись ученика на курс (админом)
- Страница "Мои курсы" для учеников
- Админка: управление записями (кто на каком курсе)

### Фаза 4: Просмотр уроков и прогресс (Неделя 4-5)
- Плеер для уроков (Bunny Stream embed)
- Отслеживание прогресса: отметка "урок пройден", время просмотра
- Прогресс-бар на дашборде ученика

### Фаза 5: Админ-дашборд и аналитика (Неделя 5-6)
- Метрики: кол-во учеников, регистрации, популярные курсы
- Управление пользователями
- CSV-экспорт данных

### Фаза 6 (после MVP)
- **Интеграция оплаты**: YooKassa (РФ/СНГ), Click/Payme (Узбекистан)
- Автоматическая запись после оплаты
- Email-уведомления
- Сертификаты по завершению курса
- Промокоды/скидки
- Мультиязычность (русский + узбекский)

---

## Структура проекта

```
RASTISHKA_CRM/
  docker-compose.yml
  .env.example
  package.json
  prisma/
    schema.prisma
    seed.ts
  src/
    app/
      (public)/          — лендинг, каталог, вход/регистрация
      (student)/         — личный кабинет, уроки, прогресс
      (admin)/           — CRM-панель, аналитика
      api/               — API-эндпоинты
    components/
      ui/                — shadcn/ui компоненты
      layout/            — Header, Sidebar, Footer
      courses/           — CourseCard, LessonPlayer, ProgressBar
      admin/             — StatsCard, DataTable, Charts
    lib/
      db.ts              — Prisma-клиент
      auth.ts            — Auth.js конфигурация
    middleware.ts        — Защита маршрутов по ролям
```

---

## Деплой

**Разработка:**
- `docker-compose.dev.yml` для PostgreSQL локально
- `npm run dev` для Next.js
- `npx prisma studio` для визуального просмотра БД

**Продакшн (любой VPS — Hetzner, Timeweb, DigitalOcean):**
1. Клонировать репозиторий
2. Скопировать `.env.example` -> `.env`, заполнить секреты
3. `docker compose up -d`
4. `docker compose exec app npx prisma migrate deploy`
5. `docker compose exec app npx prisma db seed` (создаёт админа)

**CI/CD:** GitHub Actions — push в `main` -> SSH на сервер -> `git pull` -> `docker compose up -d --build`

---

## Верификация

- Запустить `docker compose up` и убедиться что app + postgres стартуют
- Открыть сайт, пройти регистрацию/вход
- Создать курс через админку, добавить уроки
- Проверить каталог и страницу курса
- Просмотр урока и отслеживание прогресса
- Проверить админ-дашборд с метриками
