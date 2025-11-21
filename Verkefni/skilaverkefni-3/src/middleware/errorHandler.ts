import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error && Array.isArray(error.issues)) {
    const details = error.issues.map((issue: any) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      error: "Invalid data type",
      details,
    });
    return;
  }

  console.error("Unhandled error:", error);

  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong",
  });
};
