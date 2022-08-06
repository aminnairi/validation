/**
 * Validation library for forms written in TypeScript
 * Copyright (C) 2022 Amin NAIRI
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://github.com/aminnairi/validation>.
 */

export interface Rule<Target> {
  isValid: (target: SchemaTarget<Target>, property: string, value: unknown) => Promise<boolean>
}

export type Schema<Target> = {
  [TargetKey in keyof Target]: {
    [RuleKey in keyof Target[TargetKey]]: Rule<Target>
  }
}

export type SchemaTarget<Target> = {
  [Key in keyof Target]: unknown
}

export type SchemaValidations<Target> = {
  [TargetKey in keyof Target]: {
    [RuleKey in keyof Target[TargetKey]]: boolean
  } & {
    isValid: boolean
  }
} & {
  isValid: boolean
}

export const isNumber = (): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number"
});

export const isNumberEqualTo = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && expectedValue === value
});

export const isNumberNotEqualTo = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && expectedValue !== value
});

export const isNumberGreaterThan = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && value > expectedValue
});

export const isNumberLowerThan = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && value < expectedValue
});

export const isInteger = (): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && Number.isInteger(value)
});

export const isIntegerEqualTo = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && Number.isInteger(value) && expectedValue === value
});

export const isIntegerNotEqualTo = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && Number.isInteger(value) && expectedValue !== value
});

export const isIntegerGreaterThan = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && Number.isInteger(value) && value > expectedValue
});

export const isIntegerLowerThan = (expectedValue: number): Rule<Record<string, unknown>> => ({
  isValid: async (target, property, value) => typeof value === "number" && Number.isInteger(value) && value < expectedValue
});

export const isEqualToProperty = (otherProperty: string): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => target[otherProperty] === value
  }
};

export const isNotEqualToProperty = (otherProperty: string): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => target[otherProperty] !== value
  }
};

export const isOneOf = (enumeration: Array<unknown>): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => enumeration.some(enumerationValue => enumerationValue === value)
  }
};

export const isNotOneOf = (enumeration: Array<unknown>): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => enumeration.every(enumerationValue => enumerationValue !== value)
  }
};

export const isEmail = (): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => typeof value === "string" && /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(value)
  }
};

export const isPassword = (minimum: number = 8): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => typeof value === "string" && new RegExp(`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^0-9a-zA-Z]).{8,}$`).test(value)
  }
};

export const doesMatch = (regex: RegExp): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => {
      try {
        return typeof value === "string" && regex.test(value);
      } catch (error) {
        return false;
      }
    }
  };
}

export const doesNotMatch = (regex: RegExp): Rule<Record<string, unknown>> => {
  return {
    isValid: async (target, property, value) => {
      try {
        return typeof value === "string" && !regex.test(value);
      } catch (error) {
        return false;
      }
    }
  };
}

export const createValidator = <Target>(schema: Schema<Target>) => {
  const initialValidation = {
    ...Object.fromEntries(Object.entries(schema).map(([property, rules]) => {
      return [
        property,
        Object.fromEntries(Object.entries(rules as object).map(([ruleName]) => {
          return [
            ruleName,
            false
          ];
        }))
      ];
    })) as SchemaValidations<Target>,
    isValid: false
  } as SchemaValidations<Target>;

  const validate = async (target: SchemaTarget<Target>): Promise<SchemaValidations<Target>> => {
    let validations = Object.fromEntries(Object.entries(schema).map(([property, rules]) => {
      return [
        property,
        {
          ...Object.fromEntries(Object.entries(rules as object).map(([ruleName]) => {
            return [
              ruleName,
              false
            ];
          })),
          isValid: false
        }
      ]; 
    })) as SchemaValidations<Target>;

    let isValid = true;
    
    for (const property in schema) {
      const value = target[property];
      const rules = schema[property];
    
      let isValidProperty = true;
      
      for (const ruleName in rules) {
        const rule = rules[ruleName];
        
        if (await rule.isValid(target, property, value)) {
          validations = {
            ...validations,
            [property]: {
              ...validations[property],
              [ruleName]: true
            }
          };

          continue;
        }
        
        isValid = false;
        isValidProperty = false
        
        validations = {
          ...validations,
          [property]: {
            ...validations[property],
            [ruleName]: false
          }
        }
      }
      
      validations = {
        ...validations,
        [property]: {
          ...validations[property],
          isValid: isValidProperty
        }
      }
    }
    
    validations.isValid = isValid;
    
    return validations;
  };
  
  return {
    initialValidation,
    validate
  };
};