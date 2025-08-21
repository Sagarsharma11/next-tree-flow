import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const signupApi = async (payload: { email: string; password: string; }) => {
  try {
    const response = await apiInstance.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("Signup API call failed", error);
    throw error;
  }
};


export const loginApi = async (payload: { username: string; password: string; }) => {
  try {
    const response = await apiInstance.post("/token", payload);
    return response;
  } catch (error) {

    console.error("Login API call failed", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await apiInstance.post("/VerifyToken", {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Token verification failed", error);
    throw error;
  }
};

export const refreshToken = async (token: string) => {
  try {
    const response = await apiInstance.post("/refresh", {},
      {
        headers: {
          refresh_token: `${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Token verification failed", error);
    throw error;
  }
};

export const logout = async (accessToken: string, refreshToken: string) => {
  try {
    const response = await apiInstance.post("/logout", {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        refresh_token: refreshToken,
      },
    });
    return response;
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};


export const showAllProjects = async (accessToken: string) => {
  try {
    const response = await apiInstance.post(
      "/secure_scanner/projects",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create project failed", error);
    throw error;
  }
};

export const uploadFiles = async (formData: FormData, accessToken?: string) => {
  try {
    const response = await apiInstance.post("/secure_scanner/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    return response.data;
  } catch (error) {
    console.error("File upload failed", error);
    throw error;
  }
};

export const startScan = async (projectId: string, accessToken?: string) => {
  try {
    const response = await apiInstance.post(
      `/secure_scanner/start-scan/${projectId}`,
      {},
      {
        headers: {
          Accept: "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Start scan failed", error);
    throw error;
  }
};

export const stopScan = async (projectId: string, accessToken?: string) => {
  try {
    const response = await apiInstance.post(
      `/secure_scanner/stop-scan/${projectId}`,
      {},
      {
        headers: {
          Accept: "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Stop scan failed", error);
    throw error;
  }
};

export const getScanStatus = async (projectId: string, accessToken?: string) => {
  try {
    const response = await apiInstance.post(`/secure_scanner/scan-status/${projectId}`,
      {},
      {
        headers: {
          Accept: "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    console.log("status scan ", response)
    return response.data;
  } catch (error) {
    console.error("Get scan status failed", error);
    throw error;
  }
};




export const getScanReport = async (projectId: string, accessToken?: string) => {
  try {
    const response = await apiInstance.post(`/secure_scanner/reports/${projectId}`,
      {},
      {
        headers: {
          Accept: "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

    return response.data;
  } catch (error) {
    console.error("Get scan report failed", error);
    throw error;
  }
};


export const listProjectStatus = async (accessToken: string) => {
  try {
    const response = await apiInstance.post(
      "/secure_scanner/list-project-status",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("List project status failed", error);
    throw error;
  }
};


export const deleteProject = async (projectId: string, accessToken: string) => {
  try {
    const response = await apiInstance.post(
      `/secure_scanner/delete-project/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Delete project failed", error);
    throw error;
  }
};

export const generateReport = async (projectId: string, accessToken?: string) => {
  try {
    const response = await apiInstance.post(
      `/secure_scanner/generate-report/${projectId}`,
      {},
      {
        headers: {
          Accept: "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        responseType: "blob", // 👈 makes sure we get file data
      }
    );

    // Create a temporary download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${projectId}_report.pdf`); // name of file
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("Generate report failed", error);
    throw error;
  }
};

// export const generateReport = async (projectId: string, accessToken?: string) => {
//   try {
//     const response = await apiInstance.post(
//       `/secure_scanner/generate-report/${projectId}`,
//       {},
//       {
//         headers: {
//           Accept: "application/json",
//           ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Generate report failed", error);
//     throw error;
//   }
// };