const allowRoles = (...roles) => {
  return (req, res, next) => {
    const currentRole = String(req.user?.role || "").toLowerCase();
    const allowed = roles.map((role) => String(role).toLowerCase());

    if (!allowed.includes(currentRole)) {
      return res.status(403).json({
        message: "Akses ditolak! Anda tidak memiliki izin untuk fitur ini.",
      });
    }

    next();
  };
};

module.exports = allowRoles;
