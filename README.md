## Начало работы с React приложением

Для выполнения на вашем устройстве должны присутствовать следующие зависимости:
- Node.js версии v16.19.1 , можно новее, но во время разработки я использовал именно её (https://nodejs.org/en).

После утсановки Node.js копируем репозиторий.
Далее в командной строке пишем команду 'npm install', которая установит все необходимые пакеты и библиотеки.

Псоле завершения установки необходимо поменять адрес (src/app/configs/Axios_configs.tsx), по которому вы будете подключаться к серверу, затем можно Собирать и Запускать приложение.

## Доступные скрипты

Основные использующееся скрыпты, которые вам нужны для запуска:

### `npm run build`

Создает приложение для производства в build папку.
Он правильно объединяет React и оптимизирует сборку для достижения наилучшей производительности.

Сборка минимизирована, а имена файлов включают хэши.
Ваше приложение готово к развертыванию!

При совершении изменений в коде, нужно опять пересобрать приложение и запустить скриптом ниже.

### `npm start`

Запускает приложение в режиме разработки.
Откройте http://localhost:3000 , чтобы просмотреть его в браузере.
В случае занятого порта в консоли будет выведена другая ссылка на сайт.

## Общая структура программы

Структуру проекта нужно соблюдать для того, чтобы проект можно было бы долго развивать и поддерживать.

### app

- app — это самый главный компонент, т.е. все остальные React-компоненты будут использованы внутри него.
- app — корень навигации в проекте. Приложение делится обычно на страницы, разделы. Вся логика переключения между страницами и логика выбора страница, которая сейчас отображена, содержится внутри компонента app;
- app содержит всю базовую логику, которая будет применена в области видимости всего приложения;
- app используется как агрегатор всех контекст провайдеров. Реакт контекст провайдеры – инструмент для передачи данных в глубину в React дереве избегая пропсов. Примеры: провайдер навигации;
- app не имеет своего отображения, но он агрегирует все страницы приложения.

### Дерево компонентов

1. Внутри /src/app есть директория pages, в ней будут располагаются страницы приложения.
2. Внутри pages есть директорию SomePage1 — компонент первой страницы приложения
3. В /src/app/pages/SomePage1/ создана директория components. В SomePage1/components помещены только такие компоненты, которые используются только в поддереве компонента SomePage1 и не используются нигде в соседних иерархиях. (В случае использования одного и того же компонента в нескольких страницах, они должны быть размещены в общей директории /src/app/components/)

### Директории для хранения кода

- src/app/components содержит все компоненты, которые равноправно используются по всему проекту. Чаще всего это глупые компоненты.
- src/app/configs содержит глобальные конфиги (т.е файлы с настройками, константами, которые могут использоваться по всему проекту). Например: навигация, API-эндпоинты и (ВАЖНО!!!) Axios запросы.
- src/app/styles содержит глобальные стили, css-константы
- src/app/utils содержит утилиты, т.е. небольшие функции, которые можно будет везде использовать. Например, логирование ошибок на сервер
- src/app/AppLayout содержит общую оболочку сайта, которая составляет и содержит реализацию NavBar, SideBar и перемещение по локациям
- src/app/fakes содержит набор фейковой даты
- src/app/types содержит типы для tsx
- src/app/images содержит все картинки для сайт

### components
Гибкие компоненты, которые могут использоваться по всему проекту, на данный момент это:
- redactors, в которых подготовлены системы обработки данных из таблицы, для их изменения или создания
- PageBode - компонент, который и является главным передатчиком, обработчиком и носителем данных. Он является как таковым скелетом, который выводит пользователю таблицу, редоктор и тд. Он работает для всех внутренних страниц чайта универсально, но систему, на данный момент, заточена только на уже созданные страницы.
- Table - компонент, рисующий таблицу, работает для всех уже созданных страниц. В него включены сортировка столбцов и перенаправление на другую страницу при нажатии упрваления.

### configs
- Axios_configs - место общего собрания всех axios запросов, на данный момент доведено до очень гибкой системы без повторения кода для всех созданных внутренных страниц.

### images
- favicon.ico - логотип классического двуцветного формата, которая на данный момент исползуется на изображении вкладки
- favicon1.ico - логотип белого цвета, который расположен на NavBar

### pages
Внутренние страницы:

- Devices, вывод устройств (Серийный номер, MAC, Номер места, Свойства)
- Tests, вывод тестов (Пользователь, Зона, Устройство, Стадия / %, Время запуска, IP)
- Users, вывод пользователей (ФИО, Табельный номер, Пароль, Токен, Доступ)
    и тд.

Внешние страницы:

- Login, страница входа в аккаунт
- NotFound, страница при переходе по несуществующей ссылке

### styles
Тут расположены все необходимые стилевые настройки для веб-интерфейса. Первые 2 папки - это шрифты согласованные маркетинговым отделом в мудборде.

- styles - это компонент измениния всех необходимых компонентов библиотеки PatternFly
- variables - компонент цветовой палитры утверждённой отделом маркетинга

### types
Язык программирования ts не отдельный язык, а язык-надстройка со статической строгой типизацией. Он необходим для решения неудобств, которые создает динамическая типизация JavaScript. TypeScript после компиляции превращается в JavaScript и в браузере не исполняется.
Но за решение определённых недостатков ts требует соблюдать типизацию и, очевидно, это вызывает необходимость создания собственный, все они хранятся в Types.