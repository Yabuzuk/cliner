# Настройка Firebase для Colibri Cyprus

## Шаги настройки:

### 1. Создайте проект Firebase
1. Перейдите на https://console.firebase.google.com/
2. Нажмите "Создать проект"
3. Введите название: "colibri-cyprus-bookings"
4. Отключите Google Analytics (не нужен)

### 2. Настройте Firestore Database
1. В консоли Firebase выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме"
4. Выберите регион: europe-west (ближайший к Кипру)

### 3. Получите конфигурацию
1. Перейдите в "Настройки проекта" (шестеренка)
2. Прокрутите до "Ваши приложения"
3. Нажмите "Веб" (</>) 
4. Введите название: "colibri-website"
5. Скопируйте объект firebaseConfig

### 4. Замените конфигурацию в коде
Замените YOUR_API_KEY и другие значения в файлах:
- `index.html` (строка 87)
- `admin.html` (строка 47)

### 5. Настройте правила безопасности
В Firestore Database > Правила замените на:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{document} {
      allow read, write: if true;
    }
  }
}
```

## Готово!
После настройки заявки будут сохраняться в Firebase с автоматическим резервным копированием в localStorage.