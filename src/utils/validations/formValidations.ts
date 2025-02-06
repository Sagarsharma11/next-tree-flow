export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };
  
  export const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };
  
  export const validateField = (field: string, value: string): boolean => {
    switch (field.toLowerCase()) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "name":
        return validateName(value);
      default:
        throw new Error("Invalid field type");
    }
  };
  