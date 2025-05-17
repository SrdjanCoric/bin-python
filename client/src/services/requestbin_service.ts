const baseUrl = "http://localhost/api";

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
  try {
    console.log("newBin", newBin);
    const response = await fetch(`${baseUrl}/bins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: newBin }),
    });

    // Add debugging to see what's being returned
    const text = await response.text();
    console.log("Raw response:", text);

    try {
      // Try to parse it as JSON
      return JSON.parse(text);
    } catch (e) {
      // If it's not JSON, just return the text
      return text;
    }
  } catch (error) {
    console.error("Error in createBin:", error);
    throw error;
  }
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
