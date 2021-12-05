module.exports.form = `
    <form method="post" action="login">
        <h1>Login</h1>
        <label for="email">Email</label>
        <input id="email" name="email" type="text" placeholder="Enter email" required>
        <br><br>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter password" required>
        <br><br>
        <button type="submit" value="submit">Login</button>
    </form>
    <br>
    <p>Don't have an account? <a href="/register">Register</a>.</p>
`;

module.exports.success = `
    <p>You have successfully logged in. --> Access <a href="/account">account</a>.</p>
`;

module.exports.failure = `
    <p>Incorrect email or password. Please <a href="/login">try again</a>.</p>
`;