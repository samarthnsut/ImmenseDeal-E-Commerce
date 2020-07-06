
const development= {
    name: "development",
    cookie: "secret123",
    db:"mongodb+srv://Samarth:samarth@cluster0-xf5s7.mongodb.net/<dbname>?retryWrites=true&w=majority",
    smtp:    {
        service : 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
                 user: 'immensedeal.ecommerce@gmail.com', // generated ethereal user
                 pass: 'rplxmrfcyjrnkdav'                  // generated ethereal password
       }
    },
    googleClientID: "128517218813-00kh225uaklf403i7pjnqgr5m3qhgfhi.apps.googleusercontent.com",
    googleClientSecret: "xdmfwxzKzD1u6HJL0-x-zfI3",
    googleCallbackURL: "http://immense-inlet-15409.herokuapp.com/auth/google/callback",
    paypalClientID: 'ASXkC83ksx6j56w5pySqcLjMXbhfzhZyilrrPp3AFp87ZUpil9BUEo-X2GjNzTLYP6FvRvWRHc4mk7_M',
    paypalSecret: 'ECj4eUTjuw2pHnaI3yYq3hukyNrbenCTjdBMZEQdO9EUuYhK4-VXVINLba6n9kMWUqbpnQfXI_vfGBeR'
}

const production= {
    name: "production",
    cookie: process.env.COOKIE,
    db:"mongodb+srv://Samarth:samarth@cluster0-xf5s7.mongodb.net/<dbname>?retryWrites=true&w=majority",
    smtp:    {
        service : 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
                 user: 'immensedeal.ecommerce@gmail.com', // generated ethereal user
                 pass: 'rplxmrfcyjrnkdav'                  // generated ethereal password
       }
    },
    googleClientID: "128517218813-00kh225uaklf403i7pjnqgr5m3qhgfhi.apps.googleusercontent.com",
    googleClientSecret: "xdmfwxzKzD1u6HJL0-x-zfI3",
    googleCallbackURL: "http://localhost:2000/auth/google/callback",
    paypalClientID: 'ASXkC83ksx6j56w5pySqcLjMXbhfzhZyilrrPp3AFp87ZUpil9BUEo-X2GjNzTLYP6FvRvWRHc4mk7_M',
    paypalSecret: 'ECj4eUTjuw2pHnaI3yYq3hukyNrbenCTjdBMZEQdO9EUuYhK4-VXVINLba6n9kMWUqbpnQfXI_vfGBeR'

}

module.exports = development