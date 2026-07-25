const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        console.log(
  "AUTH HEADER:",
  req.headers.authorization
);

console.log(
  "TOKEN:",
  token
);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

         console.log(
    "DECODED USER:",
    decoded
  );

        req.user = decoded;

        console.log(
  "AUTH USER:",
  req.user
);

        next();

    } catch (error) {

         console.log(
    "JWT ERROR:",
    error.message
  );

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = protect;