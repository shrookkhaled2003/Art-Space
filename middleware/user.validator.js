const validator = require("validator");

const validateRequest = (requiredFields) => {
    return (req, res, next) => {
        // Check for missing required fields
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(", ")}` 
            });
        }

        // Validate email format
        if (req.body.email && !validator.isEmail(req.body.email)) {
            return res.status(400).json({ 
                message: "Invalid email format" 
            });
        }

        // Ensure password is at least 8 characters long
        if (req.body.password && req.body.password.length < 8) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long" 
            });
        }

        next(); // Proceed to the controller if validation passes
    };
};

module.exports = validateRequest;
