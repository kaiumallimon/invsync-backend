// imports
const passport = require('passport')
const passportlocal = require('passport-local').Strategy
const User = require('./../models/user.model')


// user validation

passport.use(new passportlocal(
    {
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            // find the user by given email
            const user = await User.findOne({ email })

            // check if user exists
            if (!user) {
                return done(null, false, { message: 'No user found associated with ' + email + '.' })
            }


            // user retreived with the email given.
            // now check the given password with the user password exists

            const isMatch = await user.matchPassword(password)


            // password does not matches, return a response

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password!' })
            }

            return done(null, user)


        } catch (error) {
            done(error)
        }
    }))


// serialize the user to store in the session

passport.serializeUser((user, done) => {
    done(null, user.id)
})



// deserialize the user to get the user from the session

passport.deserializeUser((id, done) => {
    try {
        const user = User.findOne(id)

        done(null, user)
    } catch (error) {
        done(error)
    }
})


// export passport

module.exports = passport