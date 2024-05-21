import { ValueObject } from "./core/ValueObject";

export interface PriceProps {
  value: number;
}

const priceRegex = /^\d+(\.\d{1,2})?$/;

export class Price extends ValueObject<PriceProps> {
  public readonly value: number;

  private constructor(props: PriceProps) {
    super(props);
    this.value = props.value;
  }

  public static create(value: string) {
    const isValidNumber = !isNaN(+value);

    if (!isValidNumber) {
      throw new ValidationError("Only numbers are allowed");
    } else {
      if (!priceRegex.test(value)) {
        throw new ValidationError("Invalid price format");
      } else if (+value > 999.99) {
        throw new ValidationError("The max possible price is 999.99");
      } else {
        return new Price({ value: +value });
      }
    }
  }
}

export class ValidationError extends Error {}
