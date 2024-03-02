//@ts-nocheck
const RESPONSE_CODE = {
  created: (data) => {
    return {
      message: "Creation Succeeded",
      code: 201,
      data: data,
    };
  },
  retrieve: (data) => {
    return {
      message: "Data Retrieve Succeeded",
      code: 200,
      data: data,
    };
  },
  patch: (id) => {
    return {
      message: "Data Patch Succeeded",
      data: {
        id: id,
      },
      code: 200,
    };
  },
  authorized: (data) => {
    return {
      message: "Authorized",
      data,
      code: 200,
    };
  },
};

export default RESPONSE_CODE;
