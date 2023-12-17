'use strict';

addEventListener("DOMContentLoaded", () => {

    class Count {
        constructor(index, title, date, picture) {
            this.title = title;
            this.dateFix = date;
            this.date = new Date(+date.split('-')[0], +date.split('-')[1] - 1, +date.split('-')[2], 0, 0, 0, 0).getTime();
            this.picture = picture;
            this.parent = document.querySelector('.wrapper');
            this.numberOfCounters = document.querySelectorAll('.count').length;
            this.index = index;
            this.hasDatePassed = this.date - new Date().getTime() > 0 ? false : true;
        }
        
        // Создать DOM счетчика
        createCount = () => {
            const count = document.createElement('div');
            count.classList.add('item');
            count.innerHTML = `
                <div class="count" id="holiday-${this.index}" style="background-image: url(${this.picture})">
                    <div class="del">
                        <div>
                            <h2>${this.title}</h2>
                            <div class="del-wrap">
                                <div class="time days">
                                    <div class="time-num"></div>
                                    <div class="time-text"></div>
                                </div>
                                <div class="time hours">
                                    <div class="time-num"></div>
                                    <div class="time-text"></div>
                                </div>
                                <div class="time minutes">
                                    <div class="time-num"></div>
                                    <div class="time-text"></div>
                                </div>
                                <div class="time seconds">
                                    <div class="time-num"></div>
                                    <div class="time-text"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="trash">
                                <img src="img/trash.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="curtain">
                        <h2>${this.dateFix.split('-')[2]}.${this.dateFix.split('-')[1]}.${this.dateFix.split('-')[0]}</h2>
                        <h2>Дата уже прошла</h2>
                        <div class="trash">
                            <img src="img/trash.svg" alt="">
                        </div>
                    </div>
                </div>
            `;

            this.parent.append(count);
        }

        //Добавляем время на страницу
        addTime = (currentDate) => {
            const daysElem = document.querySelector(`#holiday-${this.index} .days .time-num`),
                hoursElem = document.querySelector(`#holiday-${this.index} .hours .time-num`),
                minutesElem = document.querySelector(`#holiday-${this.index} .minutes .time-num`),
                secondsElem = document.querySelector(`#holiday-${this.index} .seconds .time-num`),
                daysNum = this.getRemainsTime(this.date, currentDate).days,
                hoursNum = this.getRemainsTime(this.date, currentDate).hours,
                minutesNum = this.getRemainsTime(this.date, currentDate).minutes,
                secondsNum = this.getRemainsTime(this.date, currentDate).seconds;

            daysElem.textContent = daysNum < 10 ? '0' + daysNum : daysNum;
            hoursElem.textContent = hoursNum < 10 ? '0' + hoursNum : hoursNum;
            minutesElem.textContent = minutesNum < 10 ? '0' + minutesNum : minutesNum;
            secondsElem.textContent = secondsNum < 10 ? '0' + secondsNum : secondsNum;

            this.getNameOfTime(daysNum, hoursNum, minutesNum, secondsNum);
        }

        //Вычисляем оставшееся время
        getRemainsTime = (date, currentDate) => {
            const difference = date - currentDate,
                oneDay = 24 * 60 * 60 * 1000,
                oneHour = 60 * 60 * 1000,
                oneMinute = 60 * 1000,
                oneSecond = 1000;

            return {
                days: Math.trunc(difference / oneDay),
                hours: Math.trunc(difference % oneDay / oneHour),
                minutes: Math.trunc(difference % oneHour / oneMinute),
                seconds: Math.trunc(difference % oneMinute / oneSecond)
            };
        }

        //Склоняем единицы времени
        getNameOfTime = (daysNum, hoursNum, minutesNum, secondsNum) => {
            const days = document.querySelector(`#holiday-${this.index} .days .time-text`),
                hours = document.querySelector(`#holiday-${this.index} .hours .time-text`),
                minutes = document.querySelector(`#holiday-${this.index} .minutes .time-text`),
                seconds = document.querySelector(`#holiday-${this.index} .seconds .time-text`),

                getNames = (unit) => {
                    let elem = null,
                        time = null,
                        arr = [];

                    const arrays = [['день', 'дня', 'дней'], ['час', 'часа', 'часов'], ['минута', 'минуты', 'минут'], ['секунда', 'секунды', 'секунд']];

                    switch (true) {
                        case unit == 'day': {
                            elem = days;
                            time = daysNum;
                            arr = arrays[0];
                        }
                            break;

                        case unit == 'hour': {
                            elem = hours;
                            time = hoursNum;
                            arr = arrays[1];
                        }
                            break;

                        case unit == 'min': {
                            elem = minutes;
                            time = minutesNum;
                            arr = arrays[2];
                        }
                            break;

                        case unit == 'sec': {
                            elem = seconds;
                            time = secondsNum;
                            arr = arrays[3];
                        }
                            break;
                    }

                    //('' + time).match(/.$/) - это получение последнего символа в строке

                    if (('' + time).match(/.$/) == 1 && time != 11) {
                        elem.textContent = arr[0];
                    } else if (('' + time).match(/.$/) < 5 && ('' + time).match(/.$/) != 0 && (time < 9 || time > 14)) {
                        elem.textContent = arr[1];
                    } else {
                        elem.textContent = arr[2];
                    }
                }

            getNames('day');
            getNames('hour');
            getNames('min');
            getNames('sec');
        }
    }

    const addDelCount = {
        // Данные пользователя и хранение запуска одной итерации щетчика setInt
        userData: {},
        // Экземпляры класса Count
        instances: {},
        // Номера id
        arrId: [],
        // Кнопка закрытия модального окна
        closeBtn: document.querySelector('.close'),
        // Кнопка добавить счетчик
        addBtn: document.querySelector('.container>button'),
        // Кнопка создать счетчик
        createBtn: document.querySelector('.create'),
        // Кнопка редактировать счетчик
        editBtn: document.querySelector('.edit-btn'),
        // Модальное окно
        modal: document.querySelector('.modal'),

        // Получить индекс
        index: function () {
            let index;
            if (!this.arrId.length) {
                index = 0;
            } else {
                for (let i = 0; i < this.arrId.length; i++) {
                    if (this.arrId.indexOf(i) < 0) {
                        index = i;
                        break;
                    }
                    if (i == this.arrId.length - 1) {
                        index = i + 1
                        break;
                    }
                }
            }
            return index;
        },

        // Добавить счетчик на страницу
        addCount: function (val1 = '', val2 = '', val3 = '') {
            const index = this.index();

            if (val1 == '' && val2 == '' && val3 == '') {
                this.userData[`count-${index}`] = {
                    val1: document.querySelector('.inputs input:nth-child(1)').value,
                    val2: document.querySelector('.inputs input:nth-child(2)').value,
                    val3: document.querySelector('.inputs input:nth-child(3)').value,
                    setInt: (currentDate) => {
                        if(this.instances[`el-${index}`].hasDatePassed) {
                            document.querySelector(`#holiday-${index} .curtain`).style.display = 'block';
                        } else {
                            this.instances[`el-${index}`].addTime(currentDate);
                        }
                    }
                }
            } else {
                this.userData[`count-${index}`] = {
                    val1: val1,
                    val2: val2,
                    val3: val3,
                    setInt: (currentDate) => {
                        if(this.instances[`el-${index}`].hasDatePassed) {
                            document.querySelector(`#holiday-${index} .curtain`).style.display = 'block';
                        } else {
                            this.instances[`el-${index}`].addTime(currentDate);
                        }
                    }
                }
            }

            this.arrId.push(index);

            this.createCount(index, this.userData[`count-${index}`].val1,
                this.userData[`count-${index}`].val2,
                this.userData[`count-${index}`].val3);
            this.instances[`el-${index}`].createCount();

            this.deleteCount(index);
        },

        // Создать экземпляр счетчика
        createCount: function (index, title, date, picture) {
            this.instances[`el-${index}`] = new Count(index, title, date, picture);
        },

        // Удалить счетчик
        deleteCount: (index) => {
            document.querySelectorAll(`#holiday-${index} .trash`).forEach(el => {
                el.addEventListener('click', (e) => {
                    document.querySelector(`#holiday-${index}`).remove();
                    delete addDelCount.userData[`count-${index}`];
                    delete addDelCount.instances[`el-${index}`];
                    addDelCount.arrId.splice(addDelCount.arrId.indexOf(index), 1);
                })
            });
        },        

        // Сбросить инпуты
        resetInputs: () => {
            document.querySelector('.inputs input:nth-child(1)').value = '';
            document.querySelector('.inputs input:nth-child(2)').value = '';
            document.querySelector('.inputs input:nth-child(3)').value = '';
        },

        openModal: () => {
            addDelCount.modal.style.display = 'flex';
        },

        closeModal: () => {
            addDelCount.modal.style.display = 'none';
        }
    }

    // Новый год
    addDelCount.addCount('До нового года осталось:', '2024-01-01', 'https://wallpapers-fenix.eu/lar/180624/083332670.jpg');

    // 23 февраля
    addDelCount.addCount('До 23 февраля осталось:', '2024-02-23', 'https://foni.club/uploads/posts/2023-01/1674363602_foni-club-p-fon-patriotizm-4.jpg');

    // 8 марта
    addDelCount.addCount('До 8 марта осталось:', '2024-03-8', 'https://i1.wallbox.ru/wallpapers/small/201727/marta.jpg');

    // 1 мая
    addDelCount.addCount('До 1 мая осталось:', '2024-05-01', 'https://spezcostum.ru/upload/iblock/310/310127450f1c804a4b85826690b4188d.jpg');

    // 9 мая
    addDelCount.addCount('До 9 мая осталось:', '2024-05-09', 'https://i.artfile.ru/1536x864_1513789_[www.ArtFile.ru].jpg');

    // 12 июня
    addDelCount.addCount('До 12 июня осталось:', '2024-06-12', 'https://foto-recipes.ru/wp-content/uploads/2022/06/big-den-russian-10.jpg');

    // 4 ноября
    addDelCount.addCount('До 4 ноября осталось:', '2024-11-4', 'https://www.ippo.ru/public/article/images/e53a895063f80477a4e14cdf9614fc4851e57ca1.png');


    // Закрытие модального окна
    addDelCount.closeBtn.addEventListener('click', () => {
        addDelCount.closeModal();
        addDelCount.resetInputs();
    });

    // Открытие модального окна
    addDelCount.addBtn.addEventListener('click', () => {
        addDelCount.createBtn.style.display = 'block';
        addDelCount.editBtn.style.display = 'none';
        addDelCount.openModal();
    });

    // Создать счетчик
    addDelCount.createBtn.addEventListener('click', () => {
        addDelCount.addCount();
        addDelCount.closeModal();
        addDelCount.resetInputs();
    });

    // Итерации счетчика
    setInterval(function () {
        const currentDate = new Date().getTime();

        addDelCount.arrId.forEach(el => {
            addDelCount.userData[`count-${el}`].setInt(currentDate);
        });
    }, 1000);
});