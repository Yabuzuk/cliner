-- Создание таблицы bookings для заявок
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  area TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключаем RLS для простоты (можно включить позже для безопасности)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;