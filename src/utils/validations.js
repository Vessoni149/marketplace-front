import Swal from 'sweetalert2';


export const validateProductForm = (form)=>{
    //Validar que los campos no estén vacíos.
    if (
        !form.productName.trim() ||
        !form.brand.trim() ||
        !form.description.trim() ||
        !form.price.toString().trim() ||
        !form.amount.toString().trim()
    ) {
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Please fill in all required fields (Product Name, Brand, Description, Price, Amount)."
        });
        return false;
    }
    if (form.images.length < 2) {
        Swal.fire({
            icon: "warning",
            title: "Warning in the field 'Images'",
            text: "Please upload at least two photos."
        });
        return false;
    }

    //Validar que productName, brand y description, tengan entre x e y caracteres:
    if (!(form.productName.length >= 2 && form.productName.length <= 45) || !(form.brand.length >= 2 && form.brand.length <= 25)) {
        Swal.fire({
            icon: "warning",
            title: "Warning in the fields 'Product Name/Brand'",
            text: "Fields 'Product Name' and 'brand' must have between 2 and 25 characters."
        });
        return false;
    }
    if(!(form.description.length >= 30 && form.description.length <= 225)){
        Swal.fire({
            icon: "warning",
            title: "Warning in the fields 'Description'",
            text: "Field 'description' must have between 30 and 255 characters."
        });
        return false;
    }
    
    //validar que los campos productName, brand y description no tengan caracteres especiales.
    // eslint-disable-next-line
    const specialCharactersRegex = /[`!@#$^&*()_\-=\[\]{};':"\\|<>\/?~]/;

    if (
        specialCharactersRegex.test(form.productName) ||
        specialCharactersRegex.test(form.brand) ||
        specialCharactersRegex.test(form.description)
    ) {
        Swal.fire({
            icon: "warning",
            title: "Warning in text fields",
            text: "Fields 'Product Name', 'Brand', and 'Description' cannot contain special characters."
        });
        return false; 
    }


    //validar que los campos numericos sean numeros y que sean mayores a 0.
    if (isNaN(form.price) || !form.price || !form.amount || form.price <= 0 || isNaN(form.amount) || form.amount <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Warning in numerical fields",
            text: "Price and Amount must be valid numbers greater than 0."
        });
        return false; 
    }
    if ( form.price < 10) {
        Swal.fire({
            icon: "warning",
            title: "Warning in the field 'Price'",
            text: "The price must be at least 10 pesos."
        });
        return false;
    }

    return true;

}

export const validatePhotoFormat = (filesArray) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));
    return invalidFiles;
}

export const validatePhotoSize = (filesArray) => {
    const validFiles = filesArray.filter(file => file.size <= 10 * 1024 * 1024);
    const invalidFiles = filesArray.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "The file size exceeds the maximum allowed limit of 10MB. Please choose a smaller file."
        });
    }
    return validFiles;
}

// VALIDACIONES LOGIN Y REGISTRO:

export const validateEmail = (email) => {
    // Validar longitud máxima de 30 caracteres
    if (email.length > 30) {
        return "Email exceeds maximum length of 30 characters.";
    }

    // Validar presencia de "@" y "."
    if (!email.includes("@") || !email.includes(".")) {
        return "Email must contain '@' and '.' symbols.";
    }

    // Dividir el correo electrónico en partes antes y después del "@"
    const parts = email.split("@");
    if (parts.length !== 2) {
        return "Email format is incorrect.";
    }

    const localPart = parts[0]; // Parte local antes del "@"
    const domainPart = parts[1]; // Parte de dominio después del "@"

    // Validar que la parte local tenga al menos 3 caracteres
    if (localPart.length < 3) {
        return "At least 3 characters are required before the '@'";
    }

    // Validar que entre el "@" y el "." existan al menos 3 letras
    const atIndex = domainPart.indexOf('@');
    const dotIndex = domainPart.indexOf('.');
    if (dotIndex - atIndex < 4) {
        return "There must be at least 3 characters between the '@' and the '.'.";
    }

    // Validar que luego del "." existan al menos 2 caracteres
    if (domainPart.length - dotIndex - 1 < 2) {
        return "There must be at least 2 characters after the '.'.";
    }

    // Validar que no inicie ni termine con caracteres especiales
    if (!email.match(/^[a-zA-Z0-9].*[a-zA-Z0-9]$/)) {
        return "Email cannot start or end with special characters.";
    }

    return null; // El correo electrónico ha pasado todas las validaciones
};

export const validatePassword = (password) => {
    const minLength = 6;
    const maxLength = 16;

    // Validar longitud de la contraseña
    if (password.length < minLength || password.length > maxLength) {
        return "Password must contain between 6 and 16 characters long.";
    }

    // Validar que la contraseña contenga al menos un número
    if (!password.match(/\d/)) {
        return "Password must contain at least one number.";
    }

    // Validar que la contraseña contenga al menos un carácter especial
    // eslint-disable-next-line
    if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]/)) {
        return "Password must contain at least one special character.";
    }

    // Validar que la contraseña contenga al menos una letra mayúscula
    if (!password.match(/[A-Z]/)) {
        return "Password must contain at least one uppercase letter.";
    }

    return null; // La contraseña cumple con todas las validaciones
};

export const validateName = (name) => {
    const minLength = 3;
    const maxLength = 20;


    // Validar longitud del nombre de usuario
    if (name.length < minLength || name.length > maxLength) {
        return "Full name must be between 3 and 20 characters long.";
    }
    if (/\d/.test(name)) {
        return "Full name cannot contain numbers.";
    }

    // Verificar si el nombre contiene caracteres especiales

    if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(name)) {
        return "Full name can only contain letters and spaces.";
    }

    return null; // El nombre de usuario cumple con todas las validaciones
};

export const containsUnsafeCharacters = (input) => {
    // Lista de caracteres no permitidos
    const unsafeCharacters = ['<', '>','=','(',')', ';' , '&', '"', "'", '/', '\\'];

    // Verificar si el input contiene algún caracter no permitido
    for (let i = 0; i < unsafeCharacters.length; i++) {
        if (input.includes(unsafeCharacters[i])) {
            return true;
        }
    }
    
    return false;
};


// VALIDACIONES DEL FORMULARIO ADDRESS.

export const validatePostalCode = (postalCode) => {
    if (!postalCode || !/^\d{3,15}$/.test(postalCode)) {
        return "Invalid postal code. It should be between 3 and 15 digits.";
    }
    return null;
};

export const validateStateCity = (value, fieldName) => {
    const errors = {};

    // Validación de longitud y caracteres especiales
    const invalidChars = /[\d"'<>_!=(){}|°\-+*/:;.%$&?]/;
    const isValidLength = value.length >= 3 && value.length <= 40;

    if (!isValidLength || invalidChars.test(value)) {
        errors[fieldName] = `${fieldName === 'state' ? 'State' : 'City'} must be between 3 and 40 characters long and should not contain numbers or special characters.`;
    }

    return Object.keys(errors).length === 0 ? null : errors[fieldName];
};


export const validateStreet = (street) => {
    const invalidChars = /["'<>_!=(){}|°\-+*/:;%$&?]/;
    const isValidLength = street.length >= 1 && street.length <= 30;
    if (!street) {
        return "Street is required.";
    }
    if(!isValidLength ){
        return "Street must contain between 1 and 30 characters"
    }
    if(invalidChars.test(street)){
        return "Street cannot contain certain special characters"
    }
    return null;
};

export const validateStreetNumber = (streetNumber) => {
    const invalidChars = /["'<>_!=(){}|°\-+*/:;.%$&?]/;
    if (!streetNumber || streetNumber.length < 1 || streetNumber.length > 10 || invalidChars.test(streetNumber) || !/\d/.test(streetNumber)) {
        return "Invalid street number. It should be between 1 and 10 characters, contain at least one number, and cannot contain certain symbols.";
    }
    return null;
};

export const validateApartment = (apartment) => {
    const invalidChars = /["'<>_!={}|°\-+*/:;.%$&?]/;
    if (invalidChars.test(apartment)) {
        return "Invalid apartment. It cannot contain certain symbols.";
    }
    return null;
};

export const validateContactNumber = (contactNumber) => {
    const invalidChars = /["'<>_!=(){}|°/:;.%$&?]/;
    const isNumeric = /^\d+$/;

    if (contactNumber) {
        if (contactNumber.length < 6 || contactNumber.length > 25) {
            return "Contact number must be between 6 and 25 characters.";
        }
        if (invalidChars.test(contactNumber)) {
            return "Contact number cannot contain special characters.";
        }
        if (!isNumeric.test(contactNumber)) {
            return "Contact number must be numeric.";
        }
    }
    return null;
};
export const validateBetweenStreet = (street) => {
    if (street) {
        const invalidChars = /["'<>_!=(){}|°\-+*/:;%$&?]/;

        if (invalidChars.test(street)) {
            return "Between street cannot contain certain special characters";
        }
    }

    return null;
};

export const validateInstructions = (instructions) => {
    const invalidChars = /["'<>_!=(){}|°\-+*/:;.%$&?]/;

    if (instructions && invalidChars.test(instructions)) {
        return "Additional instructions cannot contain special characters.";
    }
    return null;
};



export const validateAddressFields = (address) => {
    // Validations
    const postalCodeError = validatePostalCode(address.postalCode);
    const stateError = validateStateCity(address.state, 'state');
    const cityError = validateStateCity(address.city, 'city');
    const streetError = validateStreet(address.street);
    const streetNumberError = validateStreetNumber(address.streetNumber);
    const apartmentError = validateApartment(address.apartment);
    const contactNumberError = validateContactNumber(address.contactNumber);
    const betweenStreet1Error = validateBetweenStreet(address.betweenStreet1);
    const betweenStreet2Error = validateBetweenStreet(address.betweenStreet2);
    const instructionsError = validateInstructions(address.additionalInstructions);

    // Collect all errors
    const errors = {
        postalCode: postalCodeError,
        state: stateError,
        city: cityError,
        street: streetError,
        streetNumber: streetNumberError,
        apartment: apartmentError,
        contactNumber: contactNumberError,
        betweenStreet1: betweenStreet1Error,
        betweenStreet2: betweenStreet2Error,
        instructions: instructionsError,
    };

    // Filter out null values
    const errorMessages = Object.values(errors).filter(error => error !== null);

    if (errorMessages.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            html: errorMessages.join('<br>'),
        });
        return false;
    }

    return true;
};