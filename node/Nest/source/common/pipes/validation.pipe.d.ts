import { ArgumentMetadata, ValidationError } from '../index';
import { ClassTransformOptions } from '../interfaces/external/class-transform-options.interface';
import { ValidatorOptions } from '../interfaces/external/validator-options.interface';
import { PipeTransform } from '../interfaces/features/pipe-transform.interface';
import { Type } from '../interfaces/type.interface';
import { ErrorHttpStatusCode } from '../utils/http-error-by-code.util';
export interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessages?: boolean;
    transformOptions?: ClassTransformOptions;
    errorHttpStatusCode?: ErrorHttpStatusCode;
    exceptionFactory?: (errors: ValidationError[]) => any;
    validateCustomDecorators?: boolean;
    expectedType?: Type<any>;
}
export declare class ValidationPipe implements PipeTransform<any> {
    protected isTransformEnabled: boolean;
    protected isDetailedOutputDisabled?: boolean;
    protected validatorOptions: ValidatorOptions;
    protected transformOptions: ClassTransformOptions;
    protected errorHttpStatusCode: ErrorHttpStatusCode;
    protected expectedType: Type<any>;
    protected exceptionFactory: (errors: ValidationError[]) => any;
    protected validateCustomDecorators: boolean;
    constructor(options?: ValidationPipeOptions);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    createExceptionFactory(): (validationErrors?: ValidationError[]) => unknown;
    private toValidate;
    private transformPrimitive;
    private toEmptyIfNil;
    private stripProtoKeys;
    private isPrimitive;
    private flattenValidationErrors;
    private mapChildrenToValidationErrors;
    private prependConstraintsWithParentProp;
}
