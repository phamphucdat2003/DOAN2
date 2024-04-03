const path = require('path');
const express = require('express');
const port = 3000;
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const app = express();
const session = require('express-session');
const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes/index');
const db = require('./config/db');
//connect to db
db.connect();
//img
app.use(express.static(path.join(__dirname, 'public')));
//post req.body
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//express-session
app.use(session({
    secret: 'datannguyen',
    resave: false,
    saveUninitialized: false,
    }));

app.use(morgan('combined'));
//handlebars
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            eq: (a,b)=> a==='Manager',
            admin: (user) => user !== 'admin123',
            sum: (a, b) => a + b,
            sub: (a, b) => a - b,
            sortable: (field, sort) => {
                const types = {
                    default: 'fa-solid fa-sort',
                    asc: 'fa-solid fa-arrow-down-short-wide',
                    desc: 'fa-solid fa-arrow-down-wide-short',
                };
                return `
                <a href="?_sort&column=${field}&type=${sort.type === 'asc' ? 'desc' : 'asc'}">
                    <i class="${field === sort.column ? types[sort.type] : types.default}"></i>
                </a>`;
            },
            sortabledaytime: (field, sort) => {
                const types = {
                    default: 'fa-solid fa-sort',
                    asc: 'fa-solid fa-arrow-down-wide-short',
                    desc: 'fa-solid fa-arrow-down-short-wide',
                };
                return `
                <a href="?_sort&column=${field}&type=${sort.type === 'asc' ? 'desc' : 'asc'}">
                    <i class="${field === sort.column ? types[sort.type] : types.default}"></i>
                </a>`;
            },
            formatdaytime: (time) => {
                var dateTime = new Date(time);
                // Lấy ngày
                var date = dateTime.getDate().toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
                // Lấy tháng (lưu ý: trong JavaScript, tháng được đếm từ 0 đến 11)
                var month = (dateTime.getMonth() + 1).toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
                // Lấy năm
                var year = dateTime.getFullYear();
                // Lấy giờ
                var hours = dateTime.getHours().toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
                // Lấy phút
                var minutes = dateTime.getMinutes().toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
                return `<h3>${date}/${month}/${year}-${hours}:${minutes}</h3>`;
            }
        },
    }),
);

app.use(methodOverride('_method'));

//custom middlewares
app.use(SortMiddleware);

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//route init
route(app);

//port 3000
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
