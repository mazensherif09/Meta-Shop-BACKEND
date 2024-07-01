const SetCookie = (options) => {
  return {
    maxAge: 2 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true, // accessible only by web server
    secure: process.env.MODE === "pro", // send only over HTTPS
    domain: ".lunadeluxo.com", // Use .lunadeluxo.com to include subdomains
    path: "/",
    sameSite: "Strict", // Required for cross-site cookies
    ...options,
  };
};

export default SetCookie;
