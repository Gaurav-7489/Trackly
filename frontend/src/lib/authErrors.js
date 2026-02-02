export function mapAuthError(error, isSignup) {
  if (!error) return null;

  const msg = error.message.toLowerCase();

  // password too short
  if (msg.includes("password") && msg.includes("6")) {
    return "Password must be at least 6 characters.";
  }

  // wrong login credentials
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid email or password")
  ) {
    return "Wrong email or password.";
  }

  // email already exists
  if (msg.includes("user already registered")) {
    return "Email already exists. Try logging in.";
  }

  // signup but email confirmation required
  if (msg.includes("email not confirmed")) {
    return "Please verify your email before logging in.";
  }

  // login without signup
  if (!isSignup && msg.includes("user not found")) {
    return "Account does not exist. Please sign up first.";
  }

  // auth provider disabled
  if (msg.includes("provider") && msg.includes("disabled")) {
    return "Email/password login is disabled by admin.";
  }

  // fallback (still human-readable)
  return "Authentication failed. Please try again.";
}
