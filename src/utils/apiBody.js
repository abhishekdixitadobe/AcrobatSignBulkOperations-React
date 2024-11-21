const generateFormData = (data) => {
  let formData = new FormData();
  formData.append("operation", data.operation);

  data.files.forEach((file, index) => {
    formData.append("updatedImagec", file);
  });

  return formData;
}

export const apiBodybyID = (id) => {
  switch (id) {
    case "/api/agreements":
      return async (data) => {
        return generateFormData(data);
      };
    case "/api/bannerAtScale":
      return async (data) => {
        return generateFormData(data);
      };
    default:
      return {};
  }
};
