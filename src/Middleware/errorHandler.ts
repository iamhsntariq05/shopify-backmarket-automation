import { Request, Response } from 'express'

export const notFoundErrorHandle = (_req: Request, res: Response, next: Function) => {
  res.status(404).json({ success: false, data: { message: 'Invalid API call' } });
};
