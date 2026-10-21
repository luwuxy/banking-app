function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("http://localhost:5173/");
    }
    
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).send("Access denied.");
    }

    next();
}

function requireCustomer(req, res, next) {
    console.log("Session:", req.session);
    console.log("User:", req.session.user);

    if (!req.session.user) {
        return res.status(401).json({
            error: "Not logged in. Session is missing."
        });
    }

    if (req.session.user.role !== "customer") {
        return res.status(403).json({
            error: `Wrong role: ${req.session.user.role}`
        });
    }

    next();
}

export {
    requireLogin,
    requireAdmin,
    requireCustomer
}