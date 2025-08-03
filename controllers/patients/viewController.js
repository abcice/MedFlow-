const RESOURCE_PATH = '/patients'
const viewController = {
    signUp(req, res, next){
    res.render('/auth/SignUp')
  },
  signIn(req, res, next){
    res.render('/auth/SignIn')
  },
  index(req, res, next){
    res.render('patients/Index', res.locals.data)
  },
  show(req, res, next){
    res.render('patients/Show', res.locals.data)
  },
  edit(req, res, next){
    res.render('patients/Edit', res.locals.data)
  },
  newView(req, res, next){
    res.render('patients/New', res.locals.data)
  },
  redirectHome(req, res, next){
    if(res.locals.data.token){
      res.redirect(`${RESOURCE_PATH}?token=${res.locals.data.token}`)
    }else {
      res.redirect(RESOURCE_PATH)
    } 
  },
  redirectShow(req, res, next){
    res.redirect(RESOURCE_PATH + `/${req.params.id}`)
  }
}

    module.exports = viewController