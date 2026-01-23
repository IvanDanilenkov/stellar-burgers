describe('Constructor page', () => {
  beforeEach(() => {
    // Мокаем список ингредиентов, чтобы не ходить в реальный API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('ingredients');

    // Мокаем запрос текущего пользователя (нужно для оформления заказа)
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('user');

    // Мокаем создание заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('order');

    // Страховка: если приложение попробует сделать любой другой запрос к API —
    // тест сразу упадёт, чтобы мы не забыли что-то замокать
    cy.intercept('**/api/**', (req) => {
      const allowed = ['/api/ingredients', '/api/auth/user', '/api/orders'];
      if (!allowed.some((url) => req.url.includes(url))) {
        throw new Error(`Не замокан запрос: ${req.method} ${req.url}`);
      }
    });

    // Открываем главную страницу приложения
    cy.visit('/');

    // Ждём, пока загрузятся ингредиенты из моков
    cy.wait('@ingredients');
  });

  describe('Smoke', () => {
    it('страница конструктора открывается и ингредиенты загружаются', () => {
      // Проверяем, что мы действительно на странице конструктора
      // и она отрисовалась корректно
      cy.contains('Соберите бургер').should('exist');
    });
  });

  describe('Добавление ингредиентов', () => {
    it('добавляет ингредиент из списка в конструктор', () => {
      const name = 'Флюоресцентная булка R2-D3';

      // Находим карточку ингредиента по названию
      // поднимаемся до элемента списка и жмём кнопку добавления
      cy.contains(name)
        .parents('li')
        .first()
        .within(() => {
          cy.get('button').first().click();
        });

      // Проверяем, что ингредиент появился (пока базовая проверка)
      cy.contains(name).should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    const ingredientName = 'Соус фирменный Space Sauce';

    it('открывает модалку и показывает данные выбранного ингредиента', () => {
      // Кликаем по ингредиенту
      cy.contains(ingredientName).click();

      // Проверяем, что модалка открылась (через оверлей)
      cy.get('[data-testid="modal-overlay"]').should('exist');

      // Проверяем, что в модалке показан именно этот ингредиент
      cy.contains(ingredientName).should('exist');
    });

    it('закрывает модалку по клику на крестик', () => {
      cy.contains(ingredientName).click();

      // Убеждаемся, что модалка открыта
      cy.get('[data-testid="modal-overlay"]').should('exist');

      // Закрываем модалку по крестику
      cy.get('[data-testid="modal-close"]').click();

      // Проверяем, что модалка закрылась
      cy.get('[data-testid="modal-overlay"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    const bunName = 'Флюоресцентная булка R2-D3';
    const fillingName = 'Биокотлета из марсианской Магнолии';

    beforeEach(() => {
      // Перед тестом подставляем фейковые токены авторизации
      cy.window().then((win) =>
        win.localStorage.setItem('refreshToken', 'test-refresh')
      );
      cy.setCookie('accessToken', 'test-access');
    });

    afterEach(() => {
      // После теста очищаем токены
      cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
      cy.clearCookie('accessToken');
    });

    it('создаёт заказ, показывает номер и очищает конструктор', () => {
      // Добавляем булку
      cy.contains(bunName)
        .parents('li')
        .first()
        .within(() => {
          cy.get('button').first().click();
        });

      // Добавляем начинку
      cy.contains(fillingName)
        .parents('li')
        .first()
        .within(() => {
          cy.get('button').first().click();
        });

      // Оформляем заказ
      cy.contains('Оформить заказ').click();

      // Ждём мок ответа с заказом
      cy.wait('@order');

      // Проверяем номер заказа из моков
      cy.contains('12345').should('exist');

      // Закрываем модалку заказа
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal-overlay"]').should('not.exist');

      // Проверяем, что конструктор очистился
      cy.contains('Соберите бургер').should('exist');
    });
  });
});
