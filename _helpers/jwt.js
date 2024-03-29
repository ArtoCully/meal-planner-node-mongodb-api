require('dotenv').config()
const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.JWT_SECRET || config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            { url: /^\/api\/users\/authenticate/, methods: ['POST'] },
            { url: /^\/api\/users\/register/, methods: ['POST'] },
            { url: /^\/api\/recipes/, methods: ['GET'] }
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
