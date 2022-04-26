// Function to validate User sign up request input
const validateNewUserInput = (data) => {
  const errors = {};
  if (!data.email || data.email === "") {
    errors.email = "Email is required";
  }
  if (!data.username || data.username === "") {
    errors.username = "Username is required";
  }
  if (!data.name || data.name === "") {
    errors.email = "Email is required";
  }
  if (!data.password || data.password === "") {
    errors.password = "Password is required";
  }

  if (!data.location || data.location === {}) {
    errors.location = "Location is required";
  }

  if (!data.pronouns || data.pronouns === "") {
    errors.pronouns = "Pronouns is required";
  }

  if (!data.preferredPronouns || data.preferredPronouns === "") {
    errors.preferredPronouns = "Preferred Pronouns is required";
  }

  return errors;
};

// Function to validate User login request input
const validateLoginUserInput = (data) => {
  const errors = {};
  if (!data.username || data.username === "") {
    errors.username = "Username is required";
  }
  if (!data.password || data.password === "") {
    errors.password = "Password is required";
  }

  return errors;
};

// Function to validate new message request input
const validateMessageInput = (data) => {
  const errors = {};
  if (!data.from || data.from === "") {
    errors.from = "From is required";
  }
  if (!data.to || data.to === "") {
    errors.password = "To  is required";
  }
  if (!data.message || data.message === "") {
    errors.message = "Message is required";
  }

  return errors;
};

// Function to validate get message request input
const validateGetMessageInput = (data) => {
  const errors = {};
  if (!data.from || data.from === "") {
    errors.from = "From is required";
  }
  if (!data.to || data.to === "") {
    errors.password = "To  is required";
  }

  return errors;
};

module.exports = {
  validateNewUserInput,
  validateLoginUserInput,
  validateMessageInput,
  validateGetMessageInput,
};
