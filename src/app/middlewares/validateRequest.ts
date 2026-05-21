import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

const parseNestedJSON = (body: any) => {
  const parsed: any = {};
  for (const key in body) {
    if (typeof body[key] === 'string') {
      const trimmed = body[key].trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        try {
          parsed[key] = JSON.parse(body[key]);
        } catch {
          parsed[key] = body[key];
        }
      } else {
        parsed[key] = body[key];
      }
    } else {
      parsed[key] = body[key];
    }
  }
  return parsed;
};

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body && !req.is('json')) {
        req.body = parseNestedJSON(req.body);
      }

      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        headers: req.headers,
        cookies: req.cookies,
        params: req.params,
      });

      // Only overwrite if the parsed property was explicitly defined in the validation schema
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params;

      if (parsed.query !== undefined) {
        Object.assign(req.query, parsed.query);
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default validateRequest;
