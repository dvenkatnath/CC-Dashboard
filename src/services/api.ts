const API_BASE_URL = 'http://localhost:3001/api';

export class ApiService {
  
  // Test API connection
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Get all projects
  static async getAllProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get project by ID
  static async getProjectById(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Create new project
  static async createProject(projectData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  static async updateProject(id: number, projectData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.message;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  static async deleteProject(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.message;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get Project Synopsis data
  static async getProjectSynopsisData() {
    try {
      const response = await fetch(`${API_BASE_URL}/project-synopsis`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching Project Synopsis data:', error);
      throw error;
    }
  }

  // Get Project Synopsis by ID
  static async getProjectSynopsisById(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/project-synopsis/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching Project Synopsis:', error);
      throw error;
    }
  }

  // Get Customer Capital Work Details
  static async getCustomerCapitalWorkDetails() {
    try {
      const response = await fetch(`${API_BASE_URL}/customer-capital-work-details`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching Customer Capital Work Details:', error);
      throw error;
    }
  }
}

export default ApiService; 