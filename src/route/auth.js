// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
//  тут ми вводимо шлях до сторінки(PATH)

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@gmail.com',
  password: 123,
  role: 1,
})
User.create({
  email: 'admin@gmail.com',
  password: 456,
  role: 2,
})
User.create({
  email: 'developer@gmail.com',
  password: 789,
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        {
          value: User.USER_ROLE.USER,
          text: 'Користувач',
        },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message:
        'Error, es obligatorio rellenar todos los campos',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message:
          'Error! El usuario con este email ya existe!',
      })
    }

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Usuario registrado con exito',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error, el usuario no esta registrado',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log(email)

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Error! Debe introducir el email!' })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error! NO existe usuario con este email!',
      })
    }
    Confirm.create(email)

    return res.status(200).json({
      message: 'La nueva solicitud esta enviada',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/recovery-confirm', function (req, res) {
  const { password, codigo } = req.body
  console.log(password, codigo)

  if (!codigo || !password) {
    return res.status(400).json({
      message: 'Error! Necesita rellenar los campos!',
    })
  }

  try {
    const email = Confirm.getData(Number(codigo))

    if (!email) {
      return res.status(400).json({
        message: 'No existe este codigo',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'No existe usuario con este email',
      })
    }
    user.password = password

    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'La contraseña esta creada',
      session,
    })

    //===
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query
  if (renew) {
    Confirm.create(email)
  }

  return res.render('signup-confirm', {
    name: 'signup-confirm',

    component: ['back-button', 'field'],

    title: 'Signup confirm page',

    data: {},
  })
})

router.post('/signup-confirm', function (req, res) {
  const { codigo, token } = req.body
  if (!codigo || !token) {
    return res.status(400).json({
      message: ' Error! Necesita rellenar los campos!',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error! No ha podido entrar a su cuenta',
      })
    }
    const email = Confirm.getData(codigo)
    if (!email) {
      return res.status(400).json({
        message: 'Este codigo no existe!',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'El codigo no es valido!',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Su correo esta confirmado.',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/login', function (req, res) {
  return res.render('login', {
    name: 'login',
    component: ['back-button', 'field', 'field-password'],
    title: 'Login page',

    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Error! Debe escribir email y contraseña!',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message: 'Erorr! NO existe usuario con este email.',
      })
    }
    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error! La contraseña es incorrecta.',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Usted entro.',
      session,
    })
  } catch (err) {
    res.status(400).json({
      message: err.message,
    })
  }

  console.log(email, password)
})

// Експортуємо глобальний роутер
module.exports = router
