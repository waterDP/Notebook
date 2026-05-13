export abstract class FileValidator<TValidationOptions = Record<string, any>> {
  constructor(protected readonly validationOptions: TValidationOptions) {}
  abstract isValid(file?: any): boolean | Promise<boolean>;
}
