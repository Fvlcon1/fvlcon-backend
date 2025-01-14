import { z } from "zod";

export const validateInput = (
  validationSchema: z.ZodType<any>, 
  validationBody: any
): { error?: any; success?: boolean } => {
  const validation = validationSchema.safeParse(validationBody);

  if (!validation.success) {
    return {
      error: {
        message: `${validation.error.issues.map((issue) => issue.message)}`
      },
    };
  }

  return { success: true };
};