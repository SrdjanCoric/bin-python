const baseUrl = "http://3.84.206.208/api";

const generateBin = async () => {
  const response = await fetch(`${baseUrl}/bins/generate`);

  return response.text();
};

const getAllBins = async () => {
  const response = await fetch(`${baseUrl}/bins`);
  return response.json();
};

const getAllRequests = async (bin_url) => {
  const response = await fetch(`${baseUrl}/bins/${bin_url}/requests`);

  return response.json();
};

const createBin = async (newBin) => {
  const response = await fetch(`${baseUrl}/bins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: newBin }),
  });

  return response.json();
};

const deleteAllRequests = async (bin_url) => {
  const response = await fetch(`${baseUrl}/bins/${bin_url}/requests/all`, {
    method: "DELETE",
  });

  return response;
};

const deleteBin = async (bin_url) => {
  const response = await fetch(`${baseUrl}/bins/${bin_url}`, {
    method: "DELETE",
  });

  return response;
};

export default {
  generateBin,
  getAllBins,
  getAllRequests,
  createBin,
  deleteAllRequests,
  deleteBin,
};
