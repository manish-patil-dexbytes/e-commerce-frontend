const validateText = (text, setEmptyError, setValidate) => {
  if (!text) {
    setEmptyError("*Field Cannot empty");
    setValidate(false);
    setTimeout(() => {
      setEmptyError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
const validateCategoryInput = (text, setEmptyError, setValidate) => {
  if (!text) {
    setEmptyError("*Please enter category name");
    setValidate(false);
    setTimeout(() => {
      setEmptyError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
const validateDescriptiionInput = (text, setEmptyError, setValidate) => {
  if (!text) {
    setEmptyError("*Please Enter description");
    setValidate(false);
    setTimeout(() => {
      setEmptyError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
const validateImageInput = (text, setEmptyError, setValidate) => {
  if (!text) {
    setEmptyError("*Please Select Image");
    setValidate(false);
    setTimeout(() => {
      setEmptyError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
const validateCategory = (category, setCategoryError, setValidate) => {
  if (!category) {
    setCategoryError("*Select category");
    setValidate(false);
  
    setTimeout(() => {
      setCategoryError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};

const validateNumber = (number, setNumberError, setValidate) => {
  const numberregx = /^[0-9]*$/; //regx for  only number inputs
  if (!numberregx.test(number)) {
    setNumberError("*Enter numeric value");
    setValidate(false);
    setTimeout(() => {
      setNumberError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};

const validatPriceDiscount = (price, discount, setError, setValidate) => {
  if (price < discount) {
    setError("*Discount cannot be more than price");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};

const validateQuantityNotLessThanZero = (quantity, setError, setValidate) => {
  if (quantity < 0) {
    setError("*Enter valid Quantity");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};

const validateAlphaNumeric = (value, setError, setValidate) => {
  const regx = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/; //regx for alpha numeric validation
  if (!regx.test(value)) {
    setError("*Enter Alpha Numeric value");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};

const validatePassword = (password, setError, setValidate) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    setError("Please enter a valid password");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
const validateEmail = (email, setError, setValidate) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return
  } else {
    setValidate(true);
  }
};
 const ValidateMedia =(media ,setError,setValidate)=>{
  if(media.length > 5){
    setError("You can select a maximum of five media.")
  setValidate(false)
  setTimeout(() => {
    setError("");
  }, 3000);
  return
  }else{
    setValidate(true);
  }
 };

const validateVariantName =(text,setError,setValidate)=>{
  if(!text){
    setError("Enter Variant Name")
    setValidate(false)
    setTimeout(()=>{
      setError("");
    },3000);
    return
  }else{
    setValidate(true);
  }
};

 const validateVariantAttribute = (attribute, setError, setValidate) => {
  if (!Array.isArray(attribute) || attribute.length === 0) {
    setError("Please enter at least one attribute");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return;
  } else {
    setValidate(true);
  }
};
const validateAttributeNotEmpty = (attribute, setError, setValidate) => {
  console.log(attribute)
  if (attribute=='') {
    setError("Enter attribute name");
    setValidate(false);
    setTimeout(() => {
      setError("");
    }, 3000);
    return;
  } else {
    setValidate(true);
  }
};

export {
  validateText,
  validateCategory,
  validateNumber,
  validatPriceDiscount,
  validateQuantityNotLessThanZero,
  validateAlphaNumeric,
  validatePassword,
  validateEmail,
  validateCategoryInput,
  validateDescriptiionInput,
  validateImageInput,
  ValidateMedia,
  validateVariantName,
  validateVariantAttribute,
  validateAttributeNotEmpty,
};
