const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");
const login = require("./login-backend");

initializePassport(passport);

const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(login);


app.get('/', (req, res) => {
  res.render("/login");
});

app.get('/stu/signup', checkAuthenticated, (req, res) => {
    res.render("signup");
});

app.get("/stu/login", checkAuthenticated, (req, res) => {
    res.render("login/stu", { messages: req.flash() });
});

app.get("/stu/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user });
});

app.get('/stu/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', "You have successfully logged out");
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/login/stu');
        });
    });
});

app.post("/stu/signup", async(req, res) => {
    let { firstName, lastName, email, password, password2 } = req.body;

    console.log({
        firstName,
        lastName,
        email,
        password,
        password2
    });

    let errors = [];

    if (!firstName || !lastName || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters long" });
    }

    if(password != password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0){
        res.render("register", {errors});
    }else{
        // Form validation has passed

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            'SELECT * FROM "Student" WHERE email = $1', 
            [email],
            (err, results)=>{
                if(err){
                    console.error('Error during SELECT:', err);
                    return res.render('register', { errors: [{ message: "Database error" }] });
                }
            
            console.log(results.rows);   

            if(results.rows.length > 0){
                errors.push({message: "Email already registered"});
                res.render('register', { errors })
            }else{
                pool.query(
                    'INSERT INTO "Student" ("firstName", "lastName", email, password) VALUES ($1, $2, $3, $4) RETURNING "studentId", password',
                    [firstName, lastName, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            console.error('Error during INSERT:', err);
                            return res.render('register', { errors: [{ message: "Database error" }] });
                        }
                        console.log(results.rows);
                        req.flash('success_msg',"You are now registered.Please log in");
                        res.redirect('/login/stu')
                    }
                )
            }
        });
    }
});

app.post("/stu/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login/stu",
    failureFlash: true
}));

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    next();
}

function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect("/login/stu");
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
