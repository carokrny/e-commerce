module.exports = `
<form method="post" action="register">
    <h1>Register</h1>
    <label for="email">Email</label>
    <input id="email" name="email" type="text" placeholder="Enter email" required>
    <br><br>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" placeholder="Enter password" required>
    <br><br>
    <button type="submit" value="submit">Register</button>
</form>
<br>
<p>Already have an account? <a href="/login">Sign in</a>.</p>
`;