export const validate =
  (schema) =>
  (req, res, next) => {
    const input = { body: req.body, query: req.query, params: req.params };
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => i.message);
      return res.status(400).json({ message: 'Validation error', details });
    }
    // attach parsed data for downstream usage if you want:
    req.valid = parsed.data;
    next();
  };
