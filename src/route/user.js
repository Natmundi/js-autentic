// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
//  тут ми вводимо шлях до сторінки(PATH)

const { User } = require('../class/user')

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назву компонентів
    component: ['back-button'],

    // вказуємо назву сторінки
    title: 'User list page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-list-data', function (req, res) {
  const list = User.getList()
  console.log(list)

  if (list.length === 0) {
    return res.status(400).json({
      message: 'La lista de usuarios esta vacia',
    })
  }

  return res.status(200).json({
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

// Експортуємо глобальний роутер
module.exports = router
