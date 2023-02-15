# ...informator...

## API для информации о компании

CRUD API для работы со списком данных позволяет создавать, запрашивать, изменять и удалять данные.
При обращениях к API сервер возвращает данные в формате json. В зависимости от состояния ответа, возвращаемая структура может содержать данные, либо ошибки.

### Создание записи

Маршрут:
```
POST /api/informator/about
```

Сервер ожидает получить текстовые данные в формате markdow и алиас страницы, доступный по ключу `alias`.
В случае успешного добавления данных сервер ответит статусом **201** и вернёт данные о созданном поставщике в формате json.

```js
{
  alias: "псевдоним страницы",
  markdown: "данные страницы в формате markdown"
}
```

### Получение данных

Маршрут:
```
GET /api/informator/about
```

Сервер возвращает статус **200** и массив объектов с данными в формате json.

```js
[
  {
    alias: "псевдоним страницы",
    markdown: "данные страницы в формате markdown"
  },
  {
    alias: "псевдоним страницы",
    markdown: "данные страницы в формате markdown"
  },
  ...
]
```

### Получение данных определённой страницы

Маршрут:
```
GET /api/informator/about/:alias
```
где `:alias` - псевдоним страницы

В случае если поставщик, под запрашиваемым идентификатором существует, сервер вернёт сатус **200** и данные бренда в формате json.

```js
{
  alias: "псевдоним страницы",
  markdown: "данные страницы в формате markdown"
}
```

Если запрашиваемая страница не существует, сервер ответит статусом **404** с описанием возникшей ошибки.

### Изменение данных страницы

Маршрут:
```
PATCH /api/informator/about/:alias
```
где `:alias` - псевдоним страницы

В случае успешного изменения данных страницы сервер ответит статусом **200** и вернёт обновлённые данные о поставщике в формате json.

```js
{
  alias: "псевдоним страницы",
  markdown: "данные страницы в формате markdown"
}
```

Если запрашиваемая страница не существует, сервер ответит статусом **404** с описанием возникшей ошибки.

### Удаление данных страницы

Маршрут:
```
DELETE /api/informator/about/:alias
```
где `:alias` - псевдоним страницы

В случае успешного удаления данных страницы сервер ответит статусом **200** и вернёт данные об удалённом поставщике в формате json.

```js
{
  alias: "псевдоним страницы",
  markdown: "данные страницы в формате markdown"
}
```

Если удаляемая страница не существует, сервер ответит статусом **404** с описанием возникшей ошибки.



## API для информации о компании

### Получение данных пользователя

Маршрут:
```
GET /api/informator/user
```

### Добавление данных пользователя

Маршрут:
```
POST /api/informator/user
```

### Изменение данных пользователя

Маршрут:
```
PATCH /api/informator/user
```

### Удаление данных пользователя

Маршрут:
```
DELETE /api/informator/user
```

### Добавление фотографии пользователяя

Маршрут:
```
PATCH /api/informator/user/photo
```

В случае успешного удаления данных страницы сервер ответит статусом **200** и вернёт данные об удалённом поставщике в формате json.

```js
{
  email: "email пользователя",
  position: "должность",
  photo: "фотография пользователя"
}
```