# Деплой на Render

## Вариант 1: Автоматический деплой через render.yaml (Рекомендуется)

1. **Подготовка репозитория:**
   - Убедитесь, что файл `render.yaml` находится в корне репозитория
   - Закоммитьте и запушьте изменения в GitHub/GitLab/Bitbucket

2. **Создание сервиса на Render:**
   - Зайдите на [render.com](https://render.com) и войдите в аккаунт
   - Нажмите "New +" → "Blueprint"
   - Подключите ваш репозиторий
   - Render автоматически обнаружит `render.yaml` и создаст все сервисы

3. **Настройка переменных окружения:**
   - После создания сервисов, откройте Web Service
   - В разделе "Environment" установите:
     - `CLIENT_URL` - URL вашего фронтенда (например, `https://your-frontend.onrender.com`)

4. **Деплой:**
   - Render автоматически запустит деплой
   - Дождитесь завершения сборки и миграций

## Вариант 2: Ручной деплой

### Шаг 1: Создание PostgreSQL базы данных

1. На Render Dashboard нажмите "New +" → "PostgreSQL"
2. Настройки:
   - **Name:** `bank-database`
   - **Database:** `BankApp`
   - **User:** `postgres`
   - **Plan:** Starter (или выше)
3. После создания скопируйте **Internal Database URL** (он будет использоваться автоматически)

### Шаг 2: Создание Web Service для Backend

1. На Render Dashboard нажмите "New +" → "Web Service"
2. Подключите ваш репозиторий
3. Настройки:
   - **Name:** `bank-backend`
   - **Environment:** `Node`
   - **Region:** Выберите ближайший регион
   - **Branch:** `main` (или ваша основная ветка)
   - **Root Directory:** `backend-nest`
   - **Build Command:** `npm install --legacy-peer-deps && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:migrate:prod`

4. **Environment Variables:**
   - `DATABASE_URL` - выберите из списка вашу базу данных `bank-database` (Render автоматически подставит connection string)
   - `JWT_SECRET` - сгенерируйте случайную строку (можно использовать встроенный генератор Render)
   - `CLIENT_URL` - URL вашего фронтенда (например, `https://your-frontend.onrender.com`)
   - `PORT` - `4000` (или оставьте пустым, Render установит автоматически)
   - `NODE_ENV` - `production`

5. **Plan:** Starter (или выше)

6. Нажмите "Create Web Service"

### Шаг 3: Деплой Frontend (опционально)

Если хотите задеплоить фронтенд тоже на Render:

1. На Render Dashboard нажмите "New +" → "Static Site"
2. Подключите репозиторий
3. Настройки:
   - **Name:** `bank-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` - URL вашего бэкенда (например, `https://bank-backend.onrender.com`)

## Важные замечания

1. **Миграции:** Автоматически выполняются при старте через команду `start:migrate:prod`

2. **WebSocket:** Render поддерживает WebSocket, но убедитесь, что используете правильный URL для подключения

3. **CORS:** Убедитесь, что `CLIENT_URL` в бэкенде совпадает с URL фронтенда

4. **База данных:** При первом деплое миграции создадут все таблицы и ENUM типы

5. **Логи:** Проверяйте логи в Render Dashboard, если что-то не работает

## Проверка деплоя

После деплоя проверьте:
- Backend доступен по адресу: `https://bank-backend.onrender.com`
- Health check: `https://bank-backend.onrender.com/auth/me` (требует авторизации)
- WebSocket: `wss://bank-backend.onrender.com/ws?token=<JWT>`

## Обновление

При каждом push в основную ветку Render автоматически пересоберёт и задеплоит приложение.

