const init = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  image_url: "",
};

function adminReducer(state = init, action) {
  if (action.type === "login") {
    return {
      ...state,
      id: action.payload.id,
      first_name: action.payload.first_name,
      last_name: action.payload.last_name,
      email: action.payload.email,
      phone_number: action.payload.phone_number,
      image_url: action.payload.image_url,
    };
  } else if (action.type === "logout") {
    return init;
  }

  return state;
}

export default adminReducer;
