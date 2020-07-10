import Joi from "joi-browser";

const Validate = (data, schema) => {
    const { error } = Joi.validate(data, schema, { abortEarly: false });

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
}

export default Validate;