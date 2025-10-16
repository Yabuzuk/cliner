# Настройка Supabase для Colibri Cyprus

## Шаги настройки:

### 1. Создайте проект Supabase
1. Перейдите на https://supabase.com/
2. Нажмите "Start your project"
3. Войдите через GitHub или создайте аккаунт
4. Нажмите "New project"
5. Название: "colibri-cyprus-bookings"
6. Пароль базы данных: создайте надежный пароль
7. Регион: Europe West (London) - ближайший к Кипру

### 2. Создайте таблицу bookings
1. Перейдите в "Table Editor"
2. Нажмите "Create a new table"
3. Название: `bookings`
4. Добавьте колонки:
   - `name` (text)
   - `phone` (text) 
   - `service_type` (text)
   - `service` (text)
   - `date` (text)
   - `time` (text)
   - `area` (text)
   - `comment` (text)
   - `created_at` (timestamptz) - уже есть по умолчанию

### 3. Настройте RLS (Row Level Security)
1. В Table Editor выберите таблицу `bookings`
2. Нажмите на шестеренку → "Edit table"
3. Отключите "Enable Row Level Security" (для простоты)

### 4. Получите конфигурацию
1. Перейдите в "Settings" → "API"
2. Скопируйте:
   - Project URL
   - anon public key

### 5. Замените конфигурацию в коде
Замените в файлах `index.html` и `admin.html`:
- `https://YOUR_PROJECT.supabase.co` → ваш Project URL
- `YOUR_ANON_KEY` → ваш anon public key

## Готово!
Supabase работает из любой страны и проще Firebase в настройке.