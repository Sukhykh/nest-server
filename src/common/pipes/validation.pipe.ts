import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export const configureValidationPipe = () => {
  return new ValidationPipe({
    exceptionFactory: (errors: ValidationError[] = []) => {
      const formattedErrors = errors.reduce((acc, error) => {
        const property = error.property;
        const value = error.value;
        const constraints = Object.values(error.constraints);
        return [
          ...acc,
          {
            value,
            property,
            constraints,
          },
        ];
      }, []);
      return new BadRequestException({
        message: 'Validation failed',
        error: formattedErrors,
      });
    },
  });
};
