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
  patch: (data) => {
    return {
      message: "Data Patch Succeeded",
      data,
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
  delete: () => {
    return {
      message: "Data Delete Succeeded",
      code: 204,
    };
  },
};

export default RESPONSE_CODE;
