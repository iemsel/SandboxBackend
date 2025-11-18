// Example middleware structure

export function exampleMiddleware(req, res, next) {
  console.log("Example middleware executed");
  next();
}
