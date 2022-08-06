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

import { createValidator, isEmail, isNumberEqualTo } from ".";

describe("@aminnairi/validation", () => {
  describe("isEmail", () => {
    it("should succeed if the email is correct", () => {
      const {validate} = createValidator({
        email: {
          isValidEmail: isEmail()
        }
      });

      validate({
        email: "email@domain.com"
      }).then(validation => {
        expect(validation.isValid).toEqual(true);
        expect(validation.email.isValid).toEqual(true);
        expect(validation.email.isValidEmail).toEqual(true);
      });
    });

    it("should fail if the email is incorrect", () => {
      const {validate} = createValidator({
        email: {
          isValidEmail: isEmail()
        }
      });

      validate({
        email: "email@domain"
      }).then(validation => {
        expect(validation.isValid).toEqual(false);
        expect(validation.email.isValid).toEqual(false);
        expect(validation.email.isValidEmail).toEqual(false);
      });
    });
  });
  
  describe("isNumberEqualTo", () => {
    it("should succeed with a valid number", () => {
      const {validate} = createValidator({
        answer: {
          isValidAnswer: isNumberEqualTo(42)
        }
      });
      
      validate({
        answer: 42
      }).then(validation => {
        expect(validation.isValid).toEqual(true);
        expect(validation.answer.isValid).toEqual(true);
        expect(validation.answer.isValidAnswer).toEqual(true);
      });
    });
  });
});