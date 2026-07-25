const authorize = (...roles) => {

    return (req, res, next) => {

        console.log(
  "ROLE IN TOKEN:",
  req.user.role
);

console.log(
  "ALLOWED ROLES:",
  roles
);

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        next();
    };
};

module.exports = authorize;