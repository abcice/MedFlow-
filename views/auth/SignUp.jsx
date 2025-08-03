const React = require('react')
function SignUp (props) {
  return (
    <div>
      <h1>Sign Up</h1>
      <form action="/users" method="POST">
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" required />
        
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/users/login">Login here</a></p>
    </div>
  )
}



module.exports = SignUp