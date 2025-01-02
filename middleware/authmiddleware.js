export const checkAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
      return next();  
  }
  res.redirect('/login'); // Redirect to the login page if not authenticated
};
// middleware/adminAuth.js


export const checkAdminAuthenticated= (req, res, next) => {
  if (req.path.startsWith('/admin')) {
      // If already authenticated as RT admin, redirect to RT admin dashboard
      if (req.session.Admin && req.session.Admin.role === 'admin') {
          return res.redirect('/adminpanel');
      }
      return next();
  }

  next();
};