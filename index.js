// import depedensi yang diperlukan
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

// membuat aplikasi dengan framework express
const app = express()

// inisialisasi secrete key yang digunakan oleh JWT
const secretKey = 'thisisverysecretkey'
const adminKey = 'thisisverysecretkey'

// enable body parser agar dapat menerima request application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// inisialisasi koneksi ke db
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: "aircraft"
})

// melakukan koneksi ke db
db.connect((err) => {
    if (err) throw err
    console.log('Database connected')
})

/*************** JWT ***************/
// fungsi untuk mengecek token dari JWT
const isAuthorized = (request, result, next) => {
    // cek apakah user sudah mengirim header 'x-api-key'
    if (typeof(request.headers['auth-token']) == 'undefined') {
        return result.status(403).json({
            success: false,
            message: 'Unauthorized. Token Is Not Provided Or Invalid'
        })
    }

    // get token dari header
    let token = request.headers['auth-token']

    // melakukan verifikasi token yang dikirim user
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return result.status(401).json({
                success: false,
                message: 'Unauthorized. Token is Token Is Not Provided Or Invalid'
            })
        }
    })

    // lanjut ke next request
    next()
}

// ---- list end point ---///

/*************** ENDPOINT ***************/
// endpoint awal
app.get('/', (request, result) => {
    result.json({
        success: true,
        message: 'Welcome To Aircraft Shop!'
    })
})

/*************** REGISTER ***************/
app.post('/register', (request, result) => {
    let data = request.body

    let sql = `
        insert into users (name, email, password)
        values ('`+data.name+`', '`+data.email+`', '`+data.password+`');
    `

    db.query(sql, (err, result) => {
        if (err) throw err
    })

    result.json({
        success: true,
        message: 'Your Account Succesfully Registered!'
    })
})

/*************** LOGIN USER ***************/
// endpoint login untuk mendapatkan token dan harus admin admin
app.post('/login', function(request, result) {
  let data = request.body
	var email = data.email;
	var password = data.password;
	if (email && password) {
		db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
        let token = jwt.sign(data.email + '|' +data.password, secretKey)
        result.json({
          success: true,
          message: 'Logged In',
          token: token
        });
			} else {
				result.json({
          success: false,
          message: 'Invalid Credential!',
        });
			}
			result.end();
		});
	}
});

/*************** AIRCRAFT SECTION ***************/
// endpoint get data pesawat dari database
app.get('/aircraft', isAuthorized, (req, res) => {
    let sql = `
        select * from aircraft
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            success: true,
            message: 'Success retrieve data from database',
            data: result
        })
    })
})

app.get('/aircraft/show/:id', isAuthorized, (req, res) => {
    let sql = `
        select * from aircraft
        where id_aircraft = `+req.params.id+`
        limit 1
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Success Getting Book Details",
            data: result[0]
        })
    })
})

/*************** TRANSACTION ***************/
app.post('/aircraft/buy/:id', isAuthorized, (req, res) => {
    let data = req.body

    db.query(`
        insert into transaction (id_user, id_aircraft)
        values ('`+data.id_user+`', '`+req.params.id+`')
    `, (err, result) => {
        if (err) throw err
    })

    db.query(`
        update aircraft
        set stock = stock - 1
        where id_aircraft = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Buy Success!"
    })
})

app.get('/aircraft/usr/:id/trs', isAuthorized, (req, res) => {
    db.query(`
        select transaction.id_ts, aircraft.name, aircraft.manufacturer, aircraft.type, aircraft.price
        from users
        right join transaction on users.id_user = transaction.id_user
        right join aircraft on transaction.id_aircraft = aircraft.id_aircraft
        where users.id_user = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err

        res.json({
            message: "Getting Transaction Success!",
            data: result
        })
    })
})

app.get('/aircraft/payment', isAuthorized, (req, res) => {
  db.query(`
  select * from pay_method
  `, (err, result) => {
    if (err) throw err
    res.json({
      message: "Getting Payment Method Success!",
      data: result
    })
  })
})


//=============================================================================//
/*************** BELOW IS ADMINISTRATOR ONLY! ***************/
/*************** BELOW IS ADMINISTRATOR ONLY! ***************/
/*************** BELOW IS ADMINISTRATOR ONLY! ***************/

//====================================   JWT   ==============================================//
const adminAuth = (request, result, next) => {
    // cek apakah user sudah mengirim header 'x-api-key'
    if (typeof(request.headers['admin-auth']) == 'undefined') {
        return result.status(403).json({
            success: false,
            message: 'Unauthorized. Token Is Not Provided Or Invalid'
        })
    }

    // get token dari header
    let token = request.headers['admin-auth']

    // melakukan verifikasi token yang dikirim user
    jwt.verify(token, adminKey, (err, decoded) => {
        if (err) {
            return result.status(401).json({
                success: false,
                message: 'Unauthorized. Token Is Not Provided Or Invalid'
            })
        }
    })

    // lanjut ke next request
    next()
}

//====================================   ADMIN LOGIN   ==============================================//
app.post('/adm/login', function(request, result) {
  let data = request.body
	var email = data.email;
	var password = data.password;
	if (email && password) {
		db.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
        let token = jwt.sign(data.email + '|' +data.password, adminKey)
        result.json({
          success: true,
          message: 'Logged In',
          token: token
        });
			} else {
				result.json({
          success: false,
          message: 'Invalid Credential!',
        });
			}
			result.end();
		});
	}
});

//====================================   GET AIRCRAFT   ==============================================//
app.get('/adm/aircraft', adminAuth, (req, res) => {
    let sql = `
        select * from aircraft
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            success: true,
            message: 'Success retrieve data from database',
            data: result
        })
    })
})

//====================================   GET AIRCRAFT BY ID   ==============================================//
app.get('/adm/aircraft/:id', adminAuth, (req, res) => {
    let sql = `
        select * from aircraft
        where id_aircraft = `+req.params.id+`
        limit 1
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Success Getting Book Details",
            data: result[0]
        })
    })
})

//====================================   POST AIRCRAFT   ==============================================//
// endpoint add data pesawat ke dataase
app.post('/adm/aircraft', adminAuth, (request, result) => {
    let data = request.body

    let sql = `
        insert into aircraft (name, type, manufacturer, price, stock)
        values ('`+data.name+`', '`+data.type+`', '`+data.manufacturer+`', '`+data.price+`', '`+data.stock+`');
    `

    db.query(sql, (err, result) => {
        if (err) throw err
    })

    result.json({
        success: true,
        message: 'Your new Aircraft has been Added!'
    })
})

//====================================   PUT AIRCRAFT BY ID   ==============================================//
// endpoint edit data pesawat ke database
app.put('/adm/aircraft/:id', adminAuth, (request, result) => {
    let data = request.body

    let sql = `
        update aircraft
        set name = '`+data.name+`', type = '`+data.type+`', manufacturer = '`+data.manufacturer+`', price = '`+data.price+`', stock = '`+data.stock+`'
        where id_aircraft = `+request.params.id+`
    `

    db.query(sql, (err, result) => {
        if (err) throw err
    })

    result.json({
        success: true,
        message: 'Aircraft Data has been updated'
    })
})

//====================================   DELETE AIRCRAFT BY ID   ==============================================//
// endpoint hapus data pesawat dari database
app.delete('/adm/aircraft/:id', adminAuth, (request, result) => {
    let sql = `
        delete from aircraft where id_aircraft = `+request.params.id+`
    `

    db.query(sql, (err, res) => {
        if (err) throw err
    })

    result.json({
        success: true,
        message: 'Aircraft Data has been deleted'
    })
})

//====================================   GET USER TRANSACTION BY ID   ==============================================//
app.get('/adm/trs/usr/:id', adminAuth, (req, res) => {
    db.query(`
        select transaction.id_ts, aircraft.name, aircraft.manufacturer, aircraft.type, aircraft.price
        from users
        right join transaction on users.id_user = transaction.id_user
        right join aircraft on transaction.id_aircraft = aircraft.id_aircraft
        where users.id_user = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err

        res.json({
            message: "Getting Transaction Success!",
            data: result
        })
    })
})
//====================================   GET ALL TRANSACTION BY ID   ==============================================//
app.get('/adm/trs/all', adminAuth, (req, res) => {
    db.query(`
      select * from transaction
    `, (err, result) => {
        if (err) throw err

        res.json({
            message: "Getting Transaction Success!",
            data: result
        })
    })
})
//==================================== PAYMENT METHOD ==============================================//
app.post('/adm/payment/add', adminAuth, (request, result) => {
    let data = request.body

    let sql = `
        insert into pay_method (name)
        values ('`+data.name+`');
    `

    db.query(sql, (err, result) => {
        if (err) throw err
    })

    result.json({
        success: true,
        message: 'Payment Method Added!'
    })
})

app.get('/adm/payment', adminAuth, (req, res) => {
  db.query(`
  select * from pay_method
  `, (err, result) => {
    if (err) throw err
    res.json({
      message: "Getting Payment Method Success!",
      data: result
    })
  })
})

//==================******************   EXPERIMENT SECTION BELOW  ******************=====================//
//==================******************   EXPERIMENT SECTION BELOW  ******************=====================//
//==================******************   EXPERIMENT SECTION BELOW  ******************=====================//

//====================================   BUY AIRCRAFT BY ID (EXP)   ==============================================//
app.post('/adm/exp/buy/:id', adminAuth, (req, res) => {
    let data = req.body

    db.query(`
        insert into trsexp (id_admin, id_aircraft, id_pm)
        values ('`+data.id_admin+`', '`+req.params.id+`', '`+data.id_pm+`')
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Buy Success!"
    })
})

//====================================   GET ADMIN TRANSACTION BY ID (EXP)   ==============================================//
app.get('/adm/exp/:id/trs', adminAuth, (req, res) => {
    db.query(`
        select trsexp.id_ts, aircraft.name, aircraft.manufacturer, aircraft.type, aircraft.price
        from admin
        right join trsexp on admin.id_admin = trsexp.id_admin
        right join aircraft on trsexp.id_aircraft = aircraft.id_aircraft
        where admin.id_admin = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err

        res.json({
            message: "Getting Transaction Success!",
            data: result
        })
    })
})
//====================================   GET ALL TRANSACTION BY ID (EXP)  ==============================================//
app.get('/adm/exp/trs/all', adminAuth, (req, res) => {
    db.query(`
      select * from trsexp
      `, (err, result) => {
        if (err) throw err

        res.json({
            message: "Getting Transaction Success!",
            data: result
        })
    })
})

//==================******************   EXPERIMENT SECTION ABOVE  ******************=====================//
//==================******************   EXPERIMENT SECTION ABOVE  ******************=====================//
//==================******************   EXPERIMENT SECTION ABOVE  ******************=====================//

/*************** ABOVE IS ADMINISTRATOR ONLY! ***************/
/*************** ABOVE IS ADMINISTRATOR ONLY! ***************/
/*************** ABOVE IS ADMINISTRATOR ONLY! ***************/

//============================================================================//

/*************** PORT ***************/
// jalankan aplikasi pada port 3000
app.listen(1337, () => {
    console.log('App is running on port 1337!')
})
