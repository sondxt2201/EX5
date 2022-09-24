function Validator(options) {

    function Validate(inputElement, rule) {
        let errorMessage = rule.test(inputElement.value);
        let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    let formElement = document.querySelector(options.form);

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();
            let isSuccess = true;
            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = Validate(inputElement, rule);
                if (!isValid) {
                    isSuccess = false;
                }
            });
            if (isSuccess) {
                // console.log("No Error");
                if (typeof options.onSubmit === 'function') {
                    let enableInput = formElement.querySelectorAll('[name]');
                    let formValues = Array.from(enableInput).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
            else {
                console.log("Error");
            };
        }
    }
    // console.log(formElement);
    if (formElement) {
        options.rules.forEach(function (rule) {
            let inputElement = formElement.querySelector(rule.selector);
            // console.log(inputElement);
            if (inputElement) {
                inputElement.onblur = function () {
                    Validate(inputElement, rule);
                }
                inputElement.oninput = function () {
                    let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('.invalid');
                }
            }
        });
    }
}




Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này!";

        }
    }
};

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value) ? undefined : "Hãy nhập email hợp lệ!";
        }
    }
};

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Mật khẩu cần có ít nhất ${min} ký tự!`;
        }
    }
};

Validator.passwordConfirmation = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : "Giá trị nhập vào không chính xác!";
        }
    }
}
