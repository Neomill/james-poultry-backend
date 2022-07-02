import prisma from "./prisma";
const argon2 = require("argon2");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const setupPassport = async () => {
  //LOCAL
  passport.use(
    new LocalStrategy(async function verify(
      username: string,
      password: string,
      done: any
    ) {
      const model = prisma.user;
      try {
        const user = await model.findFirst({
          where: {
            username,
          },
          include: {
            roles: {
              include: {
                permissions: true,
              },
            },
            employee : {
              include:{
                branch: true
              }
            }
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        if (await argon2.verify(user.password, password)) {
          return done(null, {
            id: user.id,
            username: user.username,
            roles: user.roles,
            employee: user.employee,
          });
        } else {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );

  //JWT

  var opts: any = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload: any, done: any) {
      const model = prisma.user;
      try {
        const user = await model.findFirst({
          where: {
            id: Number(jwt_payload.id),
          },
          include: {
            roles: {
              include: {
                permissions: true,
              },
            },
            employee: true,
          },
        });
        if (!user) {
          return done(null, false);
        }
        // ADD ROLES HERE
        return done(null, {
          id: user.id,
          username: user.username,
          roles: user.roles,
          employee: user.employee,
        });
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default setupPassport;
