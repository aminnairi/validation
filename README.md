# @aminnairi/validation

Validation library for forms written in TypeScript

## Requirements

- Node
- NPM

## Installation

```bash
npm install @aminnairi/validation
```

## Examples

### Form validation check

```typescript
import { createValidator, isEmail, isNumber } from "@aminnairi/validation";

const {validate} = createValidator({
  id: {
    isValidIdentifier: isNumber()
  },
  email: {
    isValidEmail: isEmail()
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "email@incorrect",
    id: 123
  });
  
  console.log(validation.isValid);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "email@incorrect.com",
    id: 123
  });
  
  console.log(validation.isValid);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### Field validation check

```typescript
import { createValidator, isEmail, isNumber } from "@aminnairi/validation";

const {validate} = createValidator({
  id: {
    isValidIdentifier: isNumber()
  },
  email: {
    isValidEmail: isEmail()
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "email@incorrect",
    id: "123"
  });
  
  console.log(validation.email.isValid);
  // false
  
  console.log(validation.id.isValid);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "email@incorrect.com",
    id: 123
  });
  
  console.log(validation.email.isValid);
  // true
  
  console.log(validation.id.isValid);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### Rule validation check

```typescript
import { createValidator, isEmail, isNumber } from "@aminnairi/validation";

const {validate} = createValidator({
  id: {
    isValidIdentifier: isNumber()
  },
  email: {
    isValidEmail: isEmail()
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "email@incorrect",
    id: "123"
  });
  
  console.log(validation.email.isValidEmail);
  // false
  
  console.log(validation.id.isValidIdentifier);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "email@incorrect.com",
    id: 123
  });
  
  console.log(validation.email.isValidEmail);
  // true
  
  console.log(validation.id.isValidIdentifier);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### Custom validation function

```typescript
import { createValidator } from "@aminnairi/validation";

const isEmailNotTaken = () => {
  return {
    isValid: async (target, property, value) => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();
        return users.every(user => user.email !== value);
      } catch {
        return false;
      }
    }
  };
};

const {validate} = createValidator({
  email: {
    isNotTaken: isEmailNotTaken()
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "sincere@april.biz"
  });
  
  console.log(validation.email.isNotTaken);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "user@domain.com"
  });
  
  console.log(validation.email.isNotTaken);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### React

```tsx
import React, { useCallback, useState, useEffect } from "react";
import { createValidator, isEmail } from "@aminnairi/validation";

const {initialValidation, validate} = createValidator({
  email: {
    isValidEmail: isEmail()
  }
});

export const Form = () => {
  const [formData, setFormData] = useState({
    email: ""
  });
  
  const [validation, setValidation] = useState(initialValidation);
  
  const updateFormData = useCallback((property) => (event) => {
    setFormData(oldFormData => ({
      ...oldFormData,
      [property]: event.target.value
    }));
  }, []);
  
  const create = useCallback((event) => {
    event.preventDefault();
    console.log(formData);
    
    if (validation.isValid) {
      // TODO: send the form
    }
  }, [formData, validation]);
  
  useEffect(() => {
    validate(formData).then(newValidation => {
      setValidation(newValidation);
    });
  }, [formData]);

  return (
    <form onSubmit={create}>
      <div>
        <input
          className={validation.email.isValid ? "text-red" : ""}
          type="email"
          value={formData.email}
          onChange={updateFormData("email")} />
        {validation.email.isValidEmail || <small>Invalid email</small>}
      </div>
      <button disabled={!validation.isValid}>Create</button>
    </form>
  );
};
```

## TypeScript

This library has been written in TypeScript with autocompletion in mind. Autocompletion will help you reduce the vector of mistake when updating a validation field or rule name throughout your code base. It is highly recommended that you use TypeScript with this library.

## API

### doesMatch

Check whether a property match a regular expression.

```typescript
import { createValidator, doesMatch } from "@aminnairi/validation";

const {validate} = createValidator({
  color: {
    isValidColor: doesMatch(/^(light|dark).*$/)
  }
});

const invalid = async () => {
  const validation = await validate({
    color: "red"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.color.isValid);
  // false

  console.log(validation.color.isValidColor);
  // false
};

const valid = async () => {
  const validation = await validate({
    color: "lightblue"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.color.isValid);
  // true

  console.log(validation.color.isValidColor);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### doesNotMatch

Check whether a property does not match a regular expression.

```typescript
import { createValidator, doesNotMatch } from "./sources";

const {validate} = createValidator({
  product: {
    isValidProductName: doesNotMatch(/^.*(chair|table).*$/i)
  }
});

const invalid = async () => {
  const validation = await validate({
    product: "Little chair"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.product.isValid);
  // false

  console.log(validation.product.isValidProductName);
  // false
};

const valid = async () => {
  const validation = await validate({
    product: "Heavy bag"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.product.isValid);
  // true

  console.log(validation.product.isValidProductName);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isEmail

Check if a string is a valid email.

```typescript
import { createValidator, isEmail } from "@aminnairi/validation";

const {validate} = createValidator({
  email: {
    isValidEmail: isEmail()
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "user@domain"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.email.isValid);
  // false

  console.log(validation.email.isValidEmail);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "email@domain.com"
  });
  
  console.log(validation.isValid);
  // true

  console.log(validation.email.isValid);
  // true

  console.log(validation.email.isValidEmail);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isEqualToProperty

Check whether a property is equal to another one.

```typescript
import { createValidator, isEqualToProperty, isPassword } from "@aminnairi/validation";

const {validate} = createValidator({
  password: {
    isValidPassword: isPassword()
  },
  passwordConfirmation: {
    isValidConfirmation: isEqualToProperty("password")
  }
});

const invalid = async () => {
  const validation = await validate({
    password: "password",
    passwordConfirmation: "confirmation"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.passwordConfirmation.isValid);
  // false

  console.log(validation.passwordConfirmation.isValidConfirmation);
  // false
};

const valid = async () => {
  const validation = await validate({
    password: "#St0nkP4ssw0rd#",
    passwordConfirmation: "#St0nkP4ssw0rd#"
  });
  
  console.log(validation.isValid);
  // true

  console.log(validation.passwordConfirmation.isValid);
  // true

  console.log(validation.passwordConfirmation.isValidConfirmation);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isInteger

Check if a property is an integer number.

```typescript
import { createValidator, isInteger } from "@aminnairi/validation";

const {validate} = createValidator({
  id: {
    isValidIdentifier: isInteger()
  }
});

const invalid = async () => {
  const validation = await validate({
    id: "123"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.id.isValid);
  // false

  console.log(validation.id.isValidIdentifier);
  // false
};

const valid = async () => {
  const validation = await validate({
    id: 123
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.id.isValid);
  // true

  console.log(validation.id.isValidIdentifier);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isIntegerEqualTo

Check if a property is an integer number and that it is equal to a given integer.

```typescript
import { createValidator, isIntegerEqualTo } from "@aminnairi/validation";

const {validate} = createValidator({
  answer: {
    isValidAnswer: isIntegerEqualTo(42)
  }
});

const invalid = async () => {
  const validation = await validate({
    answer: 123
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.answer.isValid);
  // false

  console.log(validation.answer.isValidAnswer);
  // false
};

const valid = async () => {
  const validation = await validate({
    answer: 42
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.answer.isValid);
  // true

  console.log(validation.answer.isValidAnswer);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

## isIntegerGreaterThan

Check whether a property is an integer number greater than an integer.

```typescript
import { createValidator, isIntegerGreaterThan } from "@aminnairi/validation";

const {validate} = createValidator({
  height: {
    isValidHeight: isIntegerGreaterThan(150)
  }
});

const invalid = async () => {
  const validation = await validate({
    height: 110
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.height.isValid);
  // false

  console.log(validation.height.isValidHeight);
  // false
};

const valid = async () => {
  const validation = await validate({
    height: 190
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.height.isValid);
  // true

  console.log(validation.height.isValidHeight);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isIntegerLowerThan

Check whether a property is an integer number lower than an integer.

```typescript
import { createValidator, isIntegerLowerThan } from "@aminnairi/validation";

const {validate} = createValidator({
  passengers: {
    isValidPassengerCount: isIntegerLowerThan(50)
  }
});

const invalid = async () => {
  const validation = await validate({
    passengers: 70
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.passengers.isValid);
  // false

  console.log(validation.passengers.isValidPassengerCount);
  // false
};

const valid = async () => {
  const validation = await validate({
    passengers: 45
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.passengers.isValid);
  // true

  console.log(validation.passengers.isValidPassengerCount);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isIntegerNotEqualTo

Check whether a property is an integer number not equal to an integer.

```typescript
import { createValidator, isIntegerNotEqualTo } from "@aminnairi/validation";

const {validate} = createValidator({
  guests: {
    isValidGuestCount: isIntegerNotEqualTo(4)
  }
});

const invalid = async () => {
  const validation = await validate({
    guests: 4
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.guests.isValid);
  // false

  console.log(validation.guests.isValidGuestCount);
  // false
};

const valid = async () => {
  const validation = await validate({
    guests: 7
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.guests.isValid);
  // true

  console.log(validation.guests.isValidGuestCount);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNotEqualToProperty

Check whether a property is not equal to another property.

```typescript
import { createValidator, isEmail, isNotEqualToProperty, isPassword } from "@aminnairi/validation";

const {validate} = createValidator({
  email: {
    isValidEmail: isEmail()
  },
  password: {
    isValidPassword: isPassword(),
    isSecure: isNotEqualToProperty("email")
  }
});

const invalid = async () => {
  const validation = await validate({
    email: "email@domain.com",
    password: "email@domain.com"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.password.isValid);
  // false

  console.log(validation.password.isSecure);
  // false
};

const valid = async () => {
  const validation = await validate({
    email: "email@domain.com",
    password: "~P4SSw0rd/"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.password.isValid);
  // true

  console.log(validation.password.isSecure);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNotOneOf

Check whether a property is not equal to a list of values.

```typescript
import { createValidator, isNotOneOf } from "@aminnairi/validation";

const {validate} = createValidator({
  country: {
    isValidCountry: isNotOneOf(["France", "Spain", "Germany"])
  }
});

const invalid = async () => {
  const validation = await validate({
    country: "France"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.country.isValid);
  // false

  console.log(validation.country.isValidCountry);
  // false
};

const valid = async () => {
  const validation = await validate({
    country: "Sweden"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.country.isValid);
  // true

  console.log(validation.country.isValidCountry);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNumber

Check if a value is a number.

```typescript
import { createValidator, isNumber } from "@aminnairi/validation";

const {validate} = createValidator({
  id: {
    isValidIdentifier: isNumber()
  }
});

const invalid = async () => {
  const validation = await validate({
    id: "123"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.id.isValid);
  // false

  console.log(validation.id.isValidIdentifier);
  // false
};

const valid = async () => {
  const validation = await validate({
    id: 123
  });
  
  console.log(validation.isValid);
  // true

  console.log(validation.id.isValid);
  // true

  console.log(validation.id.isValidIdentifier);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNumberEqualTo

Check whether a property is a number equal to a number.

```typescript
import { createValidator, isNumberEqualTo } from "@aminnairi/validation";

const {validate} = createValidator({
  temperature: {
    isValidTemperature: isNumberEqualTo(12.34)
  }
});

const invalid = async () => {
  const validation = await validate({
    temperature: 43.21
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.temperature.isValid);
  // false

  console.log(validation.temperature.isValidTemperature);
  // false
};

const valid = async () => {
  const validation = await validate({
    temperature: 12.34
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.temperature.isValid);
  // true

  console.log(validation.temperature.isValidTemperature);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNumberGreaterThan

Check whether a property is a number greater than a number.

```typescript
import { createValidator, isNumberGreaterThan } from "@aminnairi/validation";

const {validate} = createValidator({
  investment: {
    isValidAmount: isNumberGreaterThan(1234.56)
  }
});

const invalid = async () => {
  const validation = await validate({
    investment: 123.45
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.investment.isValid);
  // false

  console.log(validation.investment.isValidAmount);
  // false
};

const valid = async () => {
  const validation = await validate({
    investment: 2345.67
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.investment.isValid);
  // true

  console.log(validation.investment.isValidAmount);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNumberLowerThan

Check whether a property is a number lower than a number.

```typescript
import { createValidator, isNumberLowerThan } from "@aminnairi/validation";

const {validate} = createValidator({
  angle: {
    isValidAngle: isNumberLowerThan(92.31)
  }
});

const invalid = async () => {
  const validation = await validate({
    angle: 103.82
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.angle.isValid);
  // false

  console.log(validation.angle.isValidAngle);
  // false
};

const valid = async () => {
  const validation = await validate({
    angle: 23.31
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.angle.isValid);
  // true

  console.log(validation.angle.isValidAngle);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isNumberNotEqualTo

Check whether a property is a number not equal to a number.

```typescript
import { createValidator, isNumberNotEqualTo } from "@aminnairi/validation";

const {validate} = createValidator({
  price: {
    isValidPrice: isNumberNotEqualTo(99.99)
  }
});

const invalid = async () => {
  const validation = await validate({
    price: 99.99
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.price.isValid);
  // false

  console.log(validation.price.isValidPrice);
  // false
};

const valid = async () => {
  const validation = await validate({
    price: 92.75
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.price.isValid);
  // true

  console.log(validation.price.isValidPrice);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isOneOf

Check whether a property is equal to one of the value of a list.

```typescript
import { createValidator, isOneOf } from "@aminnairi/validation";

const {validate} = createValidator({
  role: {
    isValidRole: isOneOf(["USER", "ADMIN", "MOD"])
  }
});

const invalid = async () => {
  const validation = await validate({
    role: "ANONYMOUS"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.role.isValid);
  // false

  console.log(validation.role.isValidRole);
  // false
};

const valid = async () => {
  const validation = await validate({
    role: "USER"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.role.isValid);
  // true

  console.log(validation.role.isValidRole);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

### isPassword

Check whether a password contains at least one lower case letter, one upper case letter, one digit, one symbol and is at least 8 characters long.

```typescript
import { createValidator, isPassword } from "@aminnairi/password";

const {validate} = createValidator({
  password: {
    isStrong: isPassword()
  }
});

const invalid = async () => {
  const validation = await validate({
    password: "password"
  }); 
  
  console.log(validation.isValid);
  // false

  console.log(validation.password.isValid);
  // false

  console.log(validation.password.isStrong);
  // false
};

const valid = async () => {
  const validation = await validate({
    password: "t5B8FRy#53HN"
  }); 
  
  console.log(validation.isValid);
  // true

  console.log(validation.password.isValid);
  // true

  console.log(validation.password.isStrong);
  // true
};

invalid().catch(console.error);
valid().catch(console.error);
```

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## License

See [`LICENSE`](./LICENSE).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Code of conduct

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).