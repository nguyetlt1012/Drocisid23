const Authen = {
    verifyToken: async (req, res, next) => {
        try {
          const bearerToken = req.headers.authorization;
          if(bearerToken === undefined || !bearerToken.startsWith('Bearer ')) throw new Error(`Invalid Token`)
          const token = bearerToken && bearerToken.split(" ")[1];
          if (!token) throw new Error(`Invalid token`);
          const customer = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          if (!customer) throw new Error(`Cant get customer from token`);
          req.userId = customer.id
          next()
        } catch (error) {

        }
    },
    verifyRefreshToken: async (req, res, next) => {
        const bearerToken = req.headers["authorization"];
        const refreshToken = bearerToken && bearerToken.split[" "];
        if (!refreshToken) res.status(401);
        try {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
              if (err) res.status(401);
              req.userId = decoded.id;
              next();
            }
          );
        } catch (error) {
          res.status(401);
        }
    },
}


module.export = Authen