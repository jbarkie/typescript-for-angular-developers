import { required, minLength } from '@hypertheory-labs/validation-lib';

console.log(required("bird")); //todo - change to null or undefined, or leave off.
console.log(minLength(4)("cat")); // todo - same here.